import { PhoneNumber, PhoneNumberUtil } from "google-libphonenumber";
import { DateTime } from "luxon";

import { Table } from "~/database/base";
import { CompanyID } from "~/database/companyDB";
import { DBConnection } from "~/database/connection";
import { PersonID, PersonTableRow } from "~/database/personDB";
import { createUUID, tableColumn } from "~/database/utils";
import { UUID } from "~/models";

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

type CreatePersonOptions = {
  firstName: string;
  lastName: string;
  personalIdentityCode: string;
  phone: PhoneNumber | null;
  email: string;
  nationality: string;
  birthday: DateTime;
};

type UpdatePersonOptions = CreatePersonOptions;

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

export const personDS = {
  async get(params: { knex: DBConnection; id: PersonID }) {
    const person = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .where({ id: params.id })
      .first();

    return person ? formatPersonRow(person) : null;
  },

  async getByUUID(params: { knex: DBConnection; personUUID: UUID }) {
    const person = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .where({ uuid: params.personUUID })
      .first();

    return person ? formatPersonRow(person) : null;
  },

  async getAll(params: { knex: DBConnection }) {
    const persons = await params.knex<PersonTableRow>(Table.PERSONS);

    return persons.map(formatPersonRow);
  },

  async create(params: { knex: DBConnection; person: CreatePersonOptions }) {
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

  async updateByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
    person: UpdatePersonOptions;
  }) {
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

    return person ? formatPersonRow(person) : null;
  },

  async getPersonsOfCompany(params: {
    knex: DBConnection;
    companyId: CompanyID;
  }) {
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
};
