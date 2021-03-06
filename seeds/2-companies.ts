import faker from "faker";
import { v4 as uuidv4 } from "uuid";

import { doXTimes } from "./1-users";

import { CompanyTableRow } from "~/database/company/companyDatabase";
import { Table } from "~/database/tables";
import { Knex } from "knex";

const createCompany = () => ({
  uuid: uuidv4(),
  name: faker.company.companyName(),
});

export async function seed(knex: Knex): Promise<void> {
  const companies = doXTimes(25).map(createCompany);

  await knex(Table.COMPANY).insert<CompanyTableRow>(companies);
}
