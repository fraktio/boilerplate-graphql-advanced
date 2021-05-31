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

export type PersonsOfCompanyLoader = DataLoader<CompanyID, PersonID[]>;

type Reduced = { [key: string]: PersonID[] };

const groupPersonIdsByCompany = (employees: EmployeeTable[]): Reduced =>
  employees.reduce<Reduced>((accumulator, employee) => {
    const companyId = employee.companyId.toString();

    if (companyId in accumulator) {
      return {
        ...accumulator,
        [companyId]: [...accumulator[companyId], employee.personId],
      };
    }

    return {
      ...accumulator,
      [companyId]: [employee.personId],
    };
  }, {});

export class PersonsOfCompanyDataLoader extends AbstractDataLoaderBase<PersonsOfCompanyLoader> {
  protected createLoader(params: DataLoaderParams): PersonsOfCompanyLoader {
    const personsOfCompanyLoader: PersonsOfCompanyLoader = new DataLoader(
      async (ids) => {
        const employees = await employeeQueries.getEmployeesOfCompanies({
          knex: params.knex,
          companyIds: ids,
        });

        const groupedByCompany = groupPersonIdsByCompany(employees);

        return ids.map((id) =>
          id.toString() in groupedByCompany
            ? groupedByCompany[id.toString()]
            : [],
        );
      },
    );

    return personsOfCompanyLoader;
  }
}
