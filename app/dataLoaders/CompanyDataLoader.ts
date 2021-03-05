import DataLoader from "dataloader";
import { DateTime } from "luxon";

import { DataLoaderParams } from "./dataLoaders";

import { CompanyTable } from "~/dataSources/CompanyDataSource";
import { CompanyTableRow, Table, tableColumn } from "~/database/utils";
import { UUID } from "~/models";

const formatRow = (row: CompanyTableRow): CompanyTable => ({
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
        .knex<CompanyTableRow>(Table.COMPANY)
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
          `${tableColumn(Table.COMPANY, "uuid")} as companyUUID`,
          `${tableColumn(Table.PERSONS, "uuid")} as personUUID`,
        )
        .from(Table.COMPANY)
        .innerJoin(
          Table.EMPLOYEE,
          tableColumn(Table.EMPLOYEE, "companyId"),
          "=",
          tableColumn(Table.COMPANY, "id"),
        )
        .innerJoin(
          Table.PERSONS,
          tableColumn(Table.PERSONS, "id"),
          "=",
          tableColumn(Table.EMPLOYEE, "personId"),
        )
        .whereIn(tableColumn(Table.PERSONS, "uuid"), keys);

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
