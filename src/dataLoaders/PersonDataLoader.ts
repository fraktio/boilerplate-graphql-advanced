import DataLoader from "dataloader";
import { PhoneNumberUtil } from "google-libphonenumber";
import { DateTime } from "luxon";

import { DataLoaderParams } from "./dataLoaders";

import { PersonTable } from "~/dataSources/PersonDataSource";
import {
  CompanyTableRaw,
  EmployeeTableRaw,
  PersonTableRaw,
  Table,
  tableColumn,
} from "~/database/types";
import { UUID } from "~/models";

const phoneUtil = PhoneNumberUtil.getInstance();

const formatRow = (row: PersonTableRaw): PersonTable => ({
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

export class PersonDataLoader {
  person: DataLoader<UUID, PersonTable>;
  personsOfCompany: DataLoader<UUID, UUID[]>;

  constructor(opts: DataLoaderParams) {
    this.person = new DataLoader<UUID, PersonTable>(async (keys) => {
      const personRows = await opts
        .knex<PersonTableRaw>(Table.PERSONS)
        .whereIn("uuid", keys);

      const persons = personRows.reduce<{ [key: string]: PersonTable }>(
        (prev, current) => ({
          ...prev,
          [current.uuid.toString()]: formatRow(current),
        }),
        {},
      );

      return keys.map((key) => persons[key.toString()] ?? null);
    });

    this.personsOfCompany = new DataLoader<UUID, UUID[]>(async (keys) => {
      const personsRaw = await Promise.all(
        keys.map(async (key) => {
          const persons = await opts.knex
            .select<PersonTableRaw[]>(
              tableColumn<PersonTableRaw>(Table.PERSONS, "uuid"),
            )
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
            .where(tableColumn<CompanyTableRaw>(Table.COMPANY, "uuid"), key);

          return {
            companyKey: key.toString(),
            persons: persons.map((person) => person.uuid),
          };
        }),
      );

      const persons = personsRaw.reduce<{ [key: string]: UUID[] }>(
        (prev, current) => ({
          ...prev,
          [current.companyKey]: current.persons,
        }),
        {},
      );

      return keys.map((key) => persons[key.toString()] ?? null);
    });
  }
}
