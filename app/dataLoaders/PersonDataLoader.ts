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

type CompanyTableQueryRelationRaw = {
  companyUUID: UUID;
  personUUID: UUID;
};

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
      const personsRaw = await opts.knex
        .select<CompanyTableQueryRelationRaw[]>(
          `${tableColumn<CompanyTableRaw>(
            Table.COMPANY,
            "uuid",
          )} as companyUUID`,
          `${tableColumn<CompanyTableRaw>(
            Table.PERSONS,
            "uuid",
          )} as personUUID`,
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
        .whereIn(tableColumn<CompanyTableRaw>(Table.COMPANY, "uuid"), keys);

      const persons = personsRaw.reduce<{ [key: string]: UUID[] }>(
        (prev, current) => {
          const { personUUID } = current;
          const companyUUID = current.companyUUID.toString();
          if (companyUUID in prev) {
            return {
              ...prev,
              [companyUUID]: [...prev[companyUUID], personUUID],
            };
          }

          return {
            ...prev,
            [companyUUID]: [personUUID],
          };
        },
        {},
      );

      return keys.map((key) => persons[key.toString()] ?? null);
    });
  }
}
