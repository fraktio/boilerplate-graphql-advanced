import { DateTime } from "luxon";

import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import {
  companyQueries,
  CompanyID,
  CompanyTableRow,
} from "~/database/company/companyQueries";
import { DBConnection } from "~/database/connection";
import { CompaniesOfPersonDataLoader } from "~/database/employee/CompaniesOfPersonDataLoader";
import { PersonID } from "~/database/person/personQueries";
import { Maybe, PersonFilterOperation } from "~/generation/generated";
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

export const companyDB = {
  async get(params: {
    knex: DBConnection;
    companyId: CompanyID;
    companyDL: CompanyDataLoader;
  }): Promise<Maybe<CompanyTable>> {
    const company = await companyQueries.get(params);

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
  }): Promise<CompanyTable> {
    const company = await companyQueries.tryGet(params);

    params.companyDL
      .getLoader({ knex: params.knex })
      .prime(company.id, company);

    return company;
  },

  async getByUUID(params: {
    knex: DBConnection;
    companyUUID: UUID;
    companyDL: CompanyDataLoader;
  }): Promise<Maybe<CompanyTable>> {
    const company = await companyQueries.getByUUID(params);

    if (company) {
      params.companyDL
        .getLoader({ knex: params.knex })
        .prime(company.id, company);
    }

    return company;
  },

  async getAll(params: {
    knex: DBConnection;
    companyDL: CompanyDataLoader;
    filters?: PersonFilterOperation;
  }): Promise<CompanyTable[]> {
    const companies = await companyQueries.getAll(params);

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
  }): Promise<CompanyTable> {
    const company = await companyQueries.create({
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
  }): Promise<Maybe<CompanyTable>> {
    const company = await companyQueries.updateByUUID(params);

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
    companyDL: CompanyDataLoader;
    companiesOfPersonDL: CompaniesOfPersonDataLoader;
  }): Promise<CompanyTable[]> {
    const companyIds = await params.companiesOfPersonDL
      .getLoader({ knex: params.knex })
      .load(params.personId);

    const companies = await params.companyDL
      .getLoader({ knex: params.knex })
      .loadMany(companyIds);

    return companies as CompanyTable[];
  },
};
