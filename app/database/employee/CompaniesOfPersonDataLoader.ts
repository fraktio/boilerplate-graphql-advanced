import DataLoader from "dataloader";

import {
  AbstractDataLoaderBase,
  DataLoaderParams,
} from "~/database/AbstractDataLoader";
import { CompanyID } from "~/database/company/companyQueries";
import {
  employeeQueries,
  EmployeeTable,
} from "~/database/employee/employeeQueries";
import { PersonID } from "~/database/person/personQueries";

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
