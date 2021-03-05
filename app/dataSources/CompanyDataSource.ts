import { DateTime } from "luxon";

import { Table } from "~/database/base";
import { CompanyID, CompanyTableRow } from "~/database/companyDB";
import { DBConnection } from "~/database/connection";
import { PersonID } from "~/database/personDB";
import { tableColumn, createUUID } from "~/database/utils";
import { UUID } from "~/models";

export type CompanyTable = {
  id: CompanyID;
  UUID: UUID;
  name: string;
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
};

export const formatCompanyRow = (row: CompanyTableRow): CompanyTable => ({
  id: row.id,
  UUID: row.uuid,
  name: row.name,
  timestamp: {
    createdAt: DateTime.fromJSDate(row.createdAt),
    updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
  },
});

export const companyDS = {
  async get(params: { knex: DBConnection; companyId: CompanyID }) {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .where({ id: params.companyId })
      .first();

    return company ? formatCompanyRow(company) : null;
  },

  async getByUUID(params: { knex: DBConnection; companyUUID: UUID }) {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .where({ uuid: params.companyUUID })
      .first();

    return company ? formatCompanyRow(company) : null;
  },

  async getAll(params: { knex: DBConnection }) {
    const companies = await params.knex<CompanyTableRow>(Table.COMPANY);

    return companies.map(formatCompanyRow);
  },

  async create(params: { knex: DBConnection; input: { name: string } }) {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .insert({
        uuid: createUUID(),
        name: params.input.name,
      })
      .returning("*")
      .first();

    if (!company) {
      throw new Error("Could not create company");
    }

    return formatCompanyRow(company);
  },

  async updateByUUID(params: {
    knex: DBConnection;
    companyUUID: UUID;
    company: { name: string };
  }) {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .update({ name: params.company.name })
      .where({ uuid: params.companyUUID })
      .returning("*")
      .first();

    if (!company) {
      return null;
    }

    return formatCompanyRow(company);
  },

  async getCompaniesOfPerson(params: {
    knex: DBConnection;
    personId?: PersonID;
  }) {
    const companies = await params.knex
      .select<CompanyTableRow[]>(`${Table.COMPANY}.*`)
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
      .where({
        ...(params.personId && {
          [tableColumn(Table.PERSONS, "id")]: params.personId,
        }),
      });

    return companies.map(formatCompanyRow);
  },
};
