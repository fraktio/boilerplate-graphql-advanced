import { PhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { DateTime } from "luxon";

import { CompanyID } from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import { createUUID, ID, Table, tableColumn } from "~/database/tables";
import { Maybe } from "~/generation/generated";
import { UUID } from "~/generation/mappers";

export interface PersonID extends ID {
  __PersonID: never;
}

export type PersonTableRow = Readonly<{
  id: PersonID;
  uuid: UUID;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type PersonTable = {
  id: PersonID;
  UUID: UUID;
  firstName: string;
  lastName: string;
  phone: PhoneNumber;
  email: string;
  birthday: DateTime;
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
};

export const formatPersonRow = (row: PersonTableRow): PersonTable => ({
  id: row.id,
  UUID: row.uuid,
  firstName: row.firstName,
  lastName: row.lastName,
  phone: parsePhoneNumber(row.phone),
  email: row.email,
  birthday: DateTime.fromJSDate(row.birthday),
  timestamp: {
    createdAt: DateTime.fromJSDate(row.createdAt),
    updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
  },
});

export type CreatePersonOptions = {
  firstName: string;
  lastName: string;
  phone: PhoneNumber | null;
  email: string;
  birthday: DateTime;
};

export type UpdatePersonOptions = CreatePersonOptions;

export const personDB = {
  async get(params: {
    knex: DBConnection;
    id: PersonID;
  }): Promise<Maybe<PersonTable>> {
    const person = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .where({ id: params.id })
      .first();

    return person ? formatPersonRow(person) : null;
  },

  async getByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
  }): Promise<Maybe<PersonTable>> {
    const person = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .where({ uuid: params.personUUID })
      .first();

    return person ? formatPersonRow(person) : null;
  },

  async getAll(params: { knex: DBConnection }): Promise<PersonTable[]> {
    const persons = await params.knex<PersonTableRow>(Table.PERSONS);

    return persons.map(formatPersonRow);
  },

  async create(params: {
    knex: DBConnection;
    person: CreatePersonOptions;
  }): Promise<PersonTable> {
    const phone = params.person.phone?.formatInternational();
    const birthday = params.person.birthday.toJSDate();

    const persons = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .insert({
        uuid: createUUID(),
        firstName: params.person.firstName,
        lastName: params.person.lastName,
        phone,
        email: params.person.email,
        birthday,
      })
      .returning("*");

    return formatPersonRow(persons[0]);
  },

  async updateByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
    person: UpdatePersonOptions;
  }): Promise<Maybe<PersonTable>> {
    const phone = params.person.phone?.formatInternational();
    const birthday = params.person.birthday.toJSDate();

    const persons = await params
      .knex(Table.PERSONS)
      .update({
        firstName: params.person.firstName,
        lastName: params.person.lastName,
        phone,
        email: params.person.email,
        birthday,
      })
      .where({ uuid: params.personUUID })
      .returning("*");

    if (persons.length === 0) {
      return null;
    }

    return formatPersonRow(persons[0]);
  },

  async getPersonsOfCompany(params: {
    knex: DBConnection;
    companyId: CompanyID;
  }): Promise<PersonTable[]> {
    const persons = await params.knex
      .select<PersonTableRow[]>(`${Table.PERSONS}.*`)
      .from(Table.PERSONS)
      .innerJoin(
        Table.EMPLOYEE,
        tableColumn(Table.EMPLOYEE, "personId"),
        "=",
        tableColumn(Table.PERSONS, "id"),
      )
      .innerJoin(
        Table.COMPANY,
        tableColumn(Table.COMPANY, "id"),
        "=",
        tableColumn(Table.EMPLOYEE, "companyId"),
      )
      .where(tableColumn(Table.COMPANY, "id"), params.companyId);

    return persons.map(formatPersonRow);
  },

  async getPersonsByIds(params: {
    knex: DBConnection;
    personIds: readonly PersonID[];
  }) {
    const personRows = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .whereIn("id", params.personIds);

    return personRows.map(formatPersonRow);
  },
};
