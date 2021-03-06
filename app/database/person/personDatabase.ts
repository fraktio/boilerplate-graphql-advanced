import { PhoneNumber, PhoneNumberUtil } from "google-libphonenumber";
import { DateTime } from "luxon";

import { CompanyID } from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import { createUUID, ID, Table, tableColumn } from "~/database/tables";
import { UUID } from "~/graphql/generation/mappers";

export interface PersonID extends ID {
  __PersonID: never;
}

export type PersonTableRow = Readonly<{
  id: PersonID;
  uuid: UUID;
  firstName: string;
  lastName: string;
  personalIdentityCode: string;
  phone: string;
  email: string;
  nationality: string;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type PersonTable = {
  id: PersonID;
  UUID: UUID;
  firstName: string;
  lastName: string;
  personalIdentityCode: string;
  phone: PhoneNumber;
  email: string;
  nationality: string;
  birthday: DateTime;
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
};

const phoneUtil = PhoneNumberUtil.getInstance();

export const formatPersonRow = (row: PersonTableRow): PersonTable => ({
  id: row.id,
  UUID: row.uuid,
  firstName: row.firstName,
  lastName: row.lastName,
  personalIdentityCode: row.personalIdentityCode,
  phone: phoneUtil.parseAndKeepRawInput(row.phone),
  email: row.email,
  nationality: row.nationality,
  birthday: DateTime.fromJSDate(row.birthday),
  timestamp: {
    createdAt: DateTime.fromJSDate(row.createdAt),
    updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
  },
});

export type CreatePersonOptions = {
  firstName: string;
  lastName: string;
  personalIdentityCode: string;
  phone: PhoneNumber | null;
  email: string;
  nationality: string;
  birthday: DateTime;
};

export type UpdatePersonOptions = CreatePersonOptions;

export const personDB = {
  async get(params: {
    knex: DBConnection;
    id: PersonID;
  }): Promise<PersonTable | null> {
    const person = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .where({ id: params.id })
      .first();

    return person ? formatPersonRow(person) : null;
  },

  async getByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
  }): Promise<PersonTable | null> {
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
    const phone = params.person.phone?.getRawInput();
    const birthday = params.person.birthday.toJSDate();

    const persons = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .insert({
        uuid: createUUID(),
        firstName: params.person.firstName,
        lastName: params.person.lastName,
        personalIdentityCode: params.person.personalIdentityCode,
        phone,
        email: params.person.email,
        nationality: params.person.nationality,
        birthday,
      })
      .returning("*");

    if (!persons.length) {
      throw new Error("Could not insert person");
    }

    return formatPersonRow(persons[0]);
  },

  async updateByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
    person: UpdatePersonOptions;
  }): Promise<PersonTable> {
    const phone = params.person.phone?.getRawInput();
    const birthday = params.person.birthday.toJSDate();

    const person = await params
      .knex(Table.PERSONS)
      .update({
        firstName: params.person.firstName,
        lastName: params.person.lastName,
        personalIdentityCode: params.person.personalIdentityCode,
        phone,
        email: params.person.email,
        nationality: params.person.nationality,
        birthday,
      })
      .where({ uuid: params.personUUID })
      .returning("*")
      .first();

    if (!person) {
      throw new Error("Invalid userId");
    }

    return formatPersonRow(person);
  },

  async getPersonsOfCompany(params: {
    knex: DBConnection;
    companyId?: CompanyID;
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
      .where({
        ...(params.companyId && {
          [tableColumn(Table.COMPANY, "id")]: params.companyId,
        }),
      });

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
