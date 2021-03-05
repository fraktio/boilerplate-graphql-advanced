import { DateTime } from "luxon";

import { ID, Table } from "./base";
import { PersonID } from "./personDB";

import { DBConnection } from "~/database/connection";
import { tableColumn, createUUID } from "~/database/utils";
import { UUID } from "~/models";

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
  }): Promise<CompanyTable | null> {
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
    name: string;
  }): Promise<CompanyTable> {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .insert({
        uuid: createUUID(),
        name: params.name,
      })
      .returning("*")
      .first();

    if (!company) {
      throw new Error("Could not create company");
    }

    return formatCompanyRow(company);
  },

  async update(params: {
    knex: DBConnection;
    companyId: CompanyID;
    name: string;
  }): Promise<CompanyTable> {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .update({ name: params.name })
      .where({ id: params.companyId })
      .returning("*")
      .first();

    if (!company) {
      throw new Error("Could not create company");
    }

    return formatCompanyRow(company);
  },

  async getCompaniesOfPerson(params: {
    knex: DBConnection;
    personId: PersonID;
  }): Promise<CompanyTable[]> {
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
      .where({ [tableColumn(Table.PERSONS, "id")]: params.personId });

    return companies.map(formatCompanyRow);
  },
};
