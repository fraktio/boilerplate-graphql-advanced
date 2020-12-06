import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import {
  Table,
  CompanyTableRaw,
  EmployeeTableRaw,
  tableColumn,
  PersonTableRaw,
} from "~/database/types";
import { Company } from "~/generated/graphql";
import { UUID } from "~/models";

export type CompanyTable = {
  id: number;
  uuid: UUID;
  name: string;
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
};

type CreateCompanyInput = {
  name: string;
};

type CompanyModifyInput = Pick<Company, "uuid" | "name">;

export class CompanyDataSource extends DataSourceWithContext {
  private formatRow(row: CompanyTableRaw): CompanyTable {
    return {
      id: row.id,
      uuid: row.uuid,
      name: row.name,
      timestamp: {
        createdAt: DateTime.fromJSDate(row.createdAt),
        updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
      },
    };
  }

  public async getCompany(opts: { id?: number; uuid?: UUID }) {
    const company = await this.knex<CompanyTableRaw>(Table.COMPANY)
      .where(opts)
      .first();

    return company ? this.formatRow(company) : null;
  }

  public async getCompanies() {
    const companies = await this.knex<CompanyTableRaw>(Table.COMPANY);

    const formattedCompanies = companies.map(this.formatRow);

    formattedCompanies.forEach((company) => {
      this.context.dataLoaders.companyDL.company.prime(company.uuid, company);
    });

    return companies.map(this.formatRow);
  }

  public async addCompany(opts: { company: CreateCompanyInput }) {
    const company = await this.knex<CompanyTableRaw>(Table.COMPANY)
      .insert({
        uuid: (uuidv4() as unknown) as UUID,
        name: opts.company.name,
      })
      .returning("*")
      .first();

    if (!company) {
      throw new Error("Could not create company");
    }

    return this.formatRow(company);
  }

  public async updateCompany(opts: { company: CompanyModifyInput }) {
    const company = await this.knex<CompanyTableRaw>(Table.COMPANY)
      .update({ name: opts.company.name })
      .where({ uuid: opts.company.uuid })
      .returning("*")
      .first();

    if (!company) {
      throw new Error("Could not create company");
    }

    return this.formatRow(company);
  }

  public async getCompaniesOfPerson(opts: { id?: number; uuid?: UUID }) {
    const companies = await this.knex
      .select<CompanyTableRaw[]>(`${Table.COMPANY}.*`)
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
      .where({
        ...(opts.id && {
          [tableColumn<PersonTableRaw>(Table.PERSONS, "id")]: opts.id,
        }),
        ...(opts.uuid && {
          [tableColumn<PersonTableRaw>(Table.PERSONS, "uuid")]: opts.uuid,
        }),
      });

    return companies.map(this.formatRow);
  }
}
