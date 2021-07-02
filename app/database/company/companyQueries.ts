import { Knex } from "knex";
import { DateTime } from "luxon";

import { DBSession } from "~/database/connection";
import { applyStringFilters, buildFilterQuery } from "~/database/filters";
import { createUUID, ID, Table, tableColumn } from "~/database/tables";
import {
  CompanyFilter,
  CompanyFilterOperation,
  FilterOperator,
  Maybe,
} from "~/generation/generated";
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

export const companyQueries = {
  async get(params: {
    knex: DBSession;
    companyId: CompanyID;
  }): Promise<Maybe<CompanyTable>> {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .where({ id: params.companyId })
      .first();

    return company ? formatCompanyRow(company) : null;
  },

  async tryGet(params: {
    knex: DBSession;
    companyId: CompanyID;
  }): Promise<CompanyTable> {
    const company = await companyQueries.get({
      knex: params.knex,
      companyId: params.companyId,
    });

    if (!company) {
      throw new Error("Invalid companyId");
    }

    return company;
  },

  async getByUUID(params: {
    knex: DBSession;
    companyUUID: UUID;
  }): Promise<Maybe<CompanyTable>> {
    const company = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .where({ uuid: params.companyUUID })
      .first();

    return company ? formatCompanyRow(company) : null;
  },

  async getByIds(params: {
    knex: DBSession;
    companyIds: CompanyID[];
  }): Promise<CompanyTable[]> {
    const persons = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .whereIn("id", params.companyIds);

    return persons.map(formatCompanyRow);
  },

  async getAll(params: {
    knex: DBSession;
    filters?: CompanyFilterOperation;
  }): Promise<CompanyTable[]> {
    const companies = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .andWhere((qb) => addCompanyFilters(qb, params.filters));

    return companies.map(formatCompanyRow);
  },

  async create(params: {
    knex: DBSession;
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
    knex: DBSession;
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
    knex: DBSession;
    companyIds: readonly CompanyID[];
  }): Promise<CompanyTable[]> {
    const companyRows = await params
      .knex<CompanyTableRow>(Table.COMPANY)
      .whereIn("id", params.companyIds);

    return companyRows.map(formatCompanyRow);
  },
};

export function addCompanyFilters(
  queryBuilder: Knex.QueryBuilder,
  filterOperation?: CompanyFilterOperation,
): Knex.QueryBuilder {
  return buildFilterQuery(queryBuilder, applyCompanyFilters, filterOperation);
}

function applyCompanyFilters(input: {
  queryBuilder: Knex.QueryBuilder;
  filterOperator: FilterOperator;
  filter: CompanyFilter;
}): Knex.QueryBuilder {
  const { queryBuilder, filterOperator, filter } = input;

  if (filter.nameFilter) {
    return applyStringFilters({
      queryBuilder,
      filterOperator,
      field: tableColumn(Table.COMPANY, "name"),
      stringFilter: filter.nameFilter,
    });
  }

  return queryBuilder;
}
