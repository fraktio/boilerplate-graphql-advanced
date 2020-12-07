import DataLoader from "dataloader";
import { DateTime } from "luxon";

import { DataLoaderParams } from "./dataLoaders";

import { CompanyTable } from "~/dataSources/CompanyDataSource";
import {
  CompanyTableRaw,
  EmployeeTableRaw,
  PersonTableRaw,
  Table,
  tableColumn,
} from "~/database/types";
import { UUID } from "~/models";

const formatRow = (row: CompanyTableRaw): CompanyTable => ({
  id: row.id,
  UUID: row.uuid,
  name: row.name,
  timestamp: {
    createdAt: DateTime.fromJSDate(row.createdAt),
    updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
  },
});

export class CompanyDataLoader {
  company: DataLoader<UUID, CompanyTable>;
  companiesOfPerson: DataLoader<UUID, UUID[]>;

  constructor(opts: DataLoaderParams) {
    this.company = new DataLoader<UUID, CompanyTable>(async (keys) => {
      const personRows = await opts
        .knex<CompanyTableRaw>(Table.COMPANY)
        .whereIn("uuid", keys);

      const persons = personRows.reduce<{ [key: string]: CompanyTable }>(
        (prev, current) => ({
          ...prev,
          [current.uuid.toString()]: formatRow(current),
        }),
        {},
      );

      return keys.map((key) => persons[key.toString()] ?? null);
    });

    this.companiesOfPerson = new DataLoader<UUID, UUID[]>(async (keys) => {
      const personsRaw = await Promise.all(
        keys.map(async (key) => {
          const companies = await opts.knex
            .select<CompanyTableRaw[]>(
              tableColumn<CompanyTableRaw>(Table.COMPANY, "uuid"),
            )
            .from(Table.COMPANY)
            .innerJoin(
              Table.EMPLOYEE,
              tableColumn<EmployeeTableRaw>(Table.EMPLOYEE, "companyId"),
              "=",
              tableColumn<CompanyTableRaw>(Table.COMPANY, "id"),
            )
            .innerJoin(
              Table.PERSONS,
              tableColumn<PersonTableRaw>(Table.PERSONS, "id"),
              "=",
              tableColumn<EmployeeTableRaw>(Table.EMPLOYEE, "personId"),
            )
            .where(tableColumn<PersonTableRaw>(Table.PERSONS, "uuid"), key);

          return {
            person: key.toString(),
            companies: companies.map((company) => company.uuid),
          };
        }),
      );

      const persons = personsRaw.reduce<{ [key: string]: UUID[] }>(
        (prev, current) => ({
          ...prev,
          [current.person]: current.companies,
        }),
        {},
      );

      return keys.map((key) => persons[key.toString()] ?? null);
    });
  }
}
