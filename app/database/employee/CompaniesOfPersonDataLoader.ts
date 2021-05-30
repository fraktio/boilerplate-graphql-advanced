import DataLoader from "dataloader";

import { CompanyID } from "../company/companyQueries";
import { PersonID } from "../person/personQueries";

import { employeeQueries, EmployeeTable } from "./employeeQueries";

import {
  AbstractDataLoaderBase,
  DataLoaderParams,
} from "~/database/AbstractDataLoader";

export type CompaniesOfPersonLoader = DataLoader<PersonID, CompanyID[]>;

type Reduced = { [key: string]: CompanyID[] };

const groupCompanyIdsByPerson = (employees: EmployeeTable[]): Reduced =>
  employees.reduce<Reduced>((accumulator, employee) => {
    const personId = employee.personId.toString();

    if (personId in accumulator) {
      return {
        ...accumulator,
        [personId]: [...accumulator[personId], employee.companyId],
      };
    }

    return {
      ...accumulator,
      [personId]: [employee.companyId],
    };
  }, {});

export class CompaniesOfPersonDataLoader extends AbstractDataLoaderBase<CompaniesOfPersonLoader> {
  protected createLoader(params: DataLoaderParams): CompaniesOfPersonLoader {
    const companiesOfPersonLoader: CompaniesOfPersonLoader = new DataLoader(
      async (ids) => {
        const employees = await employeeQueries.getEmployeesOfPersons({
          knex: params.knex,
          personIds: ids,
        });

        const groupedByPerson = groupCompanyIdsByPerson(employees);

        return ids.map((id) =>
          id.toString() in groupedByPerson
            ? groupedByPerson[id.toString()]
            : [],
        );
      },
    );

    return companiesOfPersonLoader;
  }
}
