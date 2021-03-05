import { PhoneNumber, PhoneNumberUtil } from "google-libphonenumber";
import { DateTime } from "luxon";

import { ID, Table } from "./base";
import { CompanyID } from "./companyDB";

import { DBConnection } from "~/database/connection";
import { createUUID, tableColumn } from "~/database/utils";
import { UUID } from "~/models";

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

type CreatePersonOptions = {
  firstName: string;
  lastName: string;
  personalIdentityCode: string;
  phone: PhoneNumber | null;
  email: string;
  nationality: string;
  birthday: DateTime;
};

type UpdatePersonOptions = CreatePersonOptions & {
  uuid: UUID;
};

export const personDS = {
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

    const person = await params
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
      .returning("*")
      .first();

    if (!person) {
      throw new Error("Could not insert person");
    }

    return formatPersonRow(person);
  },

  async updatePerson(params: {
    knex: DBConnection;
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
      .where({ uuid: params.person.uuid })
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
};
