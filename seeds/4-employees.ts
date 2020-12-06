import * as Knex from "knex";

import {
  CompanyTableRaw,
  EmployeeTableRaw,
  PersonTableRaw,
  Table,
} from "../src/database/types";

function getRandomItemsFromArray<T>(array: T[], count: number): T[] {
  const shuffled = array.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count);
}

export async function seed(knex: Knex): Promise<void> {
  const persons = await knex<PersonTableRaw>(Table.PERSONS);

  const companies = await knex<CompanyTableRaw>(Table.COMPANY);
  const count = Math.floor(companies.length * 0.1);

  const relations = persons.flatMap((person) => {
    const selectedCompanies = getRandomItemsFromArray(companies, count);

    return selectedCompanies.map((company) => ({
      companyId: company.id,
      personId: person.id,
    }));
  });

  await knex<EmployeeTableRaw>(Table.EMPLOYEE).insert(relations);
}
