import { DateTime } from "luxon";

import {
  companyDB,
  CompanyID,
  CompanyTableRow,
} from "~/dataSources/company/companyDatabase";
import { PersonID } from "~/dataSources/person/personDatabase";
import { DBConnection } from "~/database/connection";
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
    return await companyDB.get(params);
  },

  async tryGet(params: { knex: DBConnection; companyId: CompanyID }) {
    return await companyDB.tryGet(params);
  },

  async getByUUID(params: { knex: DBConnection; companyUUID: UUID }) {
    return await companyDB.getByUUID(params);
  },

  async getAll(params: { knex: DBConnection }) {
    return await companyDB.getAll(params);
  },

  async create(params: { knex: DBConnection; newCompany: { name: string } }) {
    return await companyDB.create({
      knex: params.knex,
      company: params.newCompany,
    });
  },

  async updateByUUID(params: {
    knex: DBConnection;
    companyUUID: UUID;
    company: { name: string };
  }) {
    return await companyDB.updateByUUID(params);
  },

  async getCompaniesOfPerson(params: {
    knex: DBConnection;
    personId: PersonID;
  }) {
    return await companyDB.getCompaniesOfPerson(params);
  },
};
