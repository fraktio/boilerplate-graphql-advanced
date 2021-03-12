import { DateTime } from "luxon";

import { CompanyDataLoader } from "./CompanyDataLoader";

import {
  companyDB,
  CompanyID,
  CompanyTableRow,
} from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import { PersonID } from "~/database/person/personDatabase";
import { UUID } from "~/generation/mappers";

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
  async get(params: {
    knex: DBConnection;
    companyId: CompanyID;
    companyDL: CompanyDataLoader;
  }) {
    const company = await companyDB.get(params);

    if (company) {
      params.companyDL
        .getLoader({ knex: params.knex })
        .prime(company.id, company);
    }

    return company;
  },

  async tryGet(params: {
    knex: DBConnection;
    companyId: CompanyID;
    companyDL: CompanyDataLoader;
  }) {
    const company = await companyDB.tryGet(params);

    params.companyDL
      .getLoader({ knex: params.knex })
      .prime(company.id, company);

    return company;
  },

  async getByUUID(params: {
    knex: DBConnection;
    companyUUID: UUID;
    companyDL: CompanyDataLoader;
  }) {
    const company = await companyDB.getByUUID(params);

    if (company) {
      params.companyDL
        .getLoader({ knex: params.knex })
        .prime(company.id, company);
    }

    return company;
  },

  async getAll(params: { knex: DBConnection; companyDL: CompanyDataLoader }) {
    const companies = await companyDB.getAll(params);

    const dataloader = params.companyDL.getLoader({ knex: params.knex });
    companies.forEach((company) => {
      dataloader.prime(company.id, company);
    });

    return companies;
  },

  async create(params: {
    knex: DBConnection;
    newCompany: { name: string };
    companyDL: CompanyDataLoader;
  }) {
    const company = await companyDB.create({
      knex: params.knex,
      company: params.newCompany,
    });

    params.companyDL
      .getLoader({ knex: params.knex })
      .prime(company.id, company);

    return company;
  },

  async updateByUUID(params: {
    knex: DBConnection;
    companyUUID: UUID;
    company: { name: string };
    companyDL: CompanyDataLoader;
  }) {
    const company = await companyDB.updateByUUID(params);

    if (company) {
      params.companyDL
        .getLoader({ knex: params.knex })
        .prime(company.id, company);
    }

    return company;
  },

  async getCompaniesOfPerson(params: {
    knex: DBConnection;
    personId: PersonID;
  }) {
    return await companyDB.getCompaniesOfPerson(params);
  },
};
