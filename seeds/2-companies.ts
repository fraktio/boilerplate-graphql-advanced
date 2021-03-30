import { Knex } from "knex";

import { CompanyTableRow } from "../app/database/company/companyDatabase";
import { Table } from "../app/database/tables";
import { createCompany, doXTimes } from "../app/tests/testData";

export async function seed(knex: Knex): Promise<void> {
  const companies = doXTimes(25).map(createCompany);

  await knex(Table.COMPANY).insert<CompanyTableRow>(companies);
}
