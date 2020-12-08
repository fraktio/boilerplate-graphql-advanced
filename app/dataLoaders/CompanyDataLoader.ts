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

type CompanyTableQueryRelationRaw = {
  companyUUID: UUID;
  personUUID: UUID;
};

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
      const companiesRaw = await opts.knex
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
        .whereIn(tableColumn<PersonTableRaw>(Table.PERSONS, "uuid"), keys);

      const companies = companiesRaw.reduce<{ [key: string]: UUID[] }>(
        (prev, current) => {
          const { companyUUID } = current;
          const personUUID = current.personUUID.toString();

          return {
            ...prev,
            [personUUID]:
              personUUID in prev
                ? [...prev[personUUID], companyUUID]
                : [companyUUID],
          };
        },
        {},
      );

      return keys.map((key) => companies[key.toString()] ?? null);
    });
  }
}
