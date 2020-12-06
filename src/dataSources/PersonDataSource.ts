import { PhoneNumber, PhoneNumberUtil } from "google-libphonenumber";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import {
  CompanyTableRaw,
  EmployeeTableRaw,
  PersonTableRaw,
  Table,
  tableColumn,
} from "~/database/types";
import { UUID } from "~/models";

export type PersonTable = {
  id: number;
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

type UpdatePersonOptions = CreatePersonOptions & {
  uuid: UUID;
};

const phoneUtil = PhoneNumberUtil.getInstance();

export class PersonDataSource extends DataSourceWithContext {
  private formatRow(row: PersonTableRaw): PersonTable {
    return {
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
    };
  }

  public async getPerson(opts: { id?: number; uuid?: UUID }) {
    const person = await this.knex<PersonTableRaw>(Table.PERSONS)
      .where(opts)
      .first();

    return person ? this.formatRow(person) : null;
  }

  public async getPersons() {
    const personsRaw = await this.knex<PersonTableRaw>(Table.PERSONS);

    return personsRaw.map(this.formatRow);
  }

  public async createPerson(opts: CreatePersonOptions) {
    const phone = opts.phone?.getRawInput();
    const birthday = opts.birthday.toJSDate();

    const person = await this.knex<PersonTableRaw>(Table.PERSONS)
      .insert({
        uuid: (uuidv4() as unknown) as UUID,
        firstName: opts.firstName,
        lastName: opts.lastName,
        personalIdentityCode: opts.personalIdentityCode,
        phone,
        email: opts.email,
        nationality: opts.nationality,
        birthday,
      })
      .returning("*")
      .first();

    if (!person) {
      throw new Error("Could not insert person");
    }

    return this.formatRow(person);
  }

  public async updatePerson(opts: UpdatePersonOptions) {
    const phone = opts.phone?.getRawInput();
    const birthday = opts.birthday.toJSDate();

    const person = await this.knex<PersonTableRaw>(Table.PERSONS)
      .update({
        firstName: opts.firstName,
        lastName: opts.lastName,
        personalIdentityCode: opts.personalIdentityCode,
        phone,
        email: opts.email,
        nationality: opts.nationality,
        birthday,
      })
      .where({ uuid: opts.uuid })
      .returning("*")
      .first();

    return person ? this.formatRow(person) : null;
  }

  public async getPersonsOfCompany(opts: { id?: number; uuid?: UUID }) {
    const persons = await this.knex
      .select<PersonTableRaw[]>(`${Table.PERSONS}.*`)
      .from(Table.PERSONS)
      .innerJoin(
        Table.EMPLOYEE,
        tableColumn<EmployeeTableRaw>(Table.EMPLOYEE, "personId"),
        "=",
        tableColumn<PersonTableRaw>(Table.PERSONS, "id"),
      )
      .innerJoin(
        Table.COMPANY,
        tableColumn<CompanyTableRaw>(Table.COMPANY, "id"),
        "=",
        tableColumn<EmployeeTableRaw>(Table.EMPLOYEE, "companyId"),
      )
      .where({
        ...(opts.id && {
          [tableColumn<CompanyTableRaw>(Table.COMPANY, "id")]: opts.id,
        }),
        ...(opts.uuid && {
          [tableColumn<CompanyTableRaw>(Table.COMPANY, "uuid")]: opts.uuid,
        }),
      });

    return persons.map(this.formatRow);
  }
}
