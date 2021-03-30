import { DateTime } from "luxon";

import { DBConnection } from "~/database/connection";
import { createUUID, ID, Table } from "~/database/tables";
import { Maybe } from "~/generation/generated";
import { UUID } from "~/generation/mappers";

export interface CompanyID extends ID {
  __CompanyID: never;
}

export type CompanyTableRow = Readonly<{
  id: CompanyID;
  uuid: UUID;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type CompanyTable = {
  id: CompanyID;
  UUID: UUID;
  name: string;
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
};

export type CreateCompanyParams = {
  name: string;
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

export const companyDB = {
  async get(params: {
    knex: DBConnection;
    companyId: CompanyID;
  }): Promise<Maybe<CompanyTable>> {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .where({ id: params.companyId })
      .first();

    return company ? formatCompanyRow(company) : null;
  },

  async tryGet(params: {
    knex: DBConnection;
    companyId: CompanyID;
  }): Promise<CompanyTable> {
    const company = await companyDB.get({
      knex: params.knex,
      companyId: params.companyId,
    });

    if (!company) {
      throw new Error("Invalid companyId");
    }

    return company;
  },

  async getByUUID(params: {
    knex: DBConnection;
    companyUUID: UUID;
  }): Promise<Maybe<CompanyTable>> {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .where({ uuid: params.companyUUID })
      .first();

    return company ? formatCompanyRow(company) : null;
  },

  async getByIds(params: {
    knex: DBConnection;
    companyIds: CompanyID[];
  }): Promise<CompanyTable[]> {
    const persons = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .whereIn("id", params.companyIds);

    return persons.map(formatCompanyRow);
  },

  async getAll(params: { knex: DBConnection }): Promise<CompanyTable[]> {
    const companies = await params.knex<CompanyTableRow>(Table.COMPANY);

    return companies.map(formatCompanyRow);
  },

  async create(params: {
    knex: DBConnection;
    company: CreateCompanyParams;
  }): Promise<CompanyTable> {
    const companies = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .insert({
        uuid: createUUID(),
        name: params.company.name,
      })
      .returning("*");

    return formatCompanyRow(companies[0]);
  },

  async updateByUUID(params: {
    knex: DBConnection;
    companyUUID: UUID;
    company: { name: string };
  }): Promise<Maybe<CompanyTable>> {
    const companies = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .update({ name: params.company.name })
      .where({ uuid: params.companyUUID })
      .returning("*");

    if (companies.length === 0) {
      return null;
    }

    return formatCompanyRow(companies[0]);
  },

  async getCompaniesByIds(params: {
    knex: DBConnection;
    companyIds: readonly CompanyID[];
  }): Promise<CompanyTable[]> {
    const companyRows = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .whereIn("id", params.companyIds);

    return companyRows.map(formatCompanyRow);
  },
};
