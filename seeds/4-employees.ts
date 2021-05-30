import { Knex } from "knex";

import { CompanyTableRow } from "../app/database/company/companyQueries";
import { EmployeeTableRow } from "../app/database/employee/employeeQueries";
import { PersonTableRow } from "../app/database/person/personQueries";
import { Table } from "../app/database/tables";
import { mathUtils } from "../app/utils/mathUtils";

function getRandomItemsFromArray<T>(array: T[], count: number): T[] {
  return mathUtils.shuffleList(array).slice(0, count);
}

export async function seed(knex: Knex): Promise<void> {
  const persons = await knex<PersonTableRow>(Table.PERSONS);
  const companies = await knex<CompanyTableRow>(Table.COMPANY);

  const relations = companies.flatMap((company) => {
    const employeeCount = mathUtils.getRandomArbitrary(3, 8);
    const selectedPersons = getRandomItemsFromArray(persons, employeeCount);

    return selectedPersons.map((person) => ({
      companyId: company.id,
      personId: person.id,
    }));
  });

  await knex<EmployeeTableRow>(Table.EMPLOYEE).insert(relations);
}
