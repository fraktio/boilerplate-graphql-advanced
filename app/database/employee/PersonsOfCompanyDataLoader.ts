import DataLoader from "dataloader";

import { CompanyID } from "../company/companyDatabase";
import { PersonID } from "../person/personDatabase";

import { employeeDB, EmployeeTable } from "./employeeDatabase";

import {
  AbstractDataLoaderBase,
  DataLoaderParams,
} from "~/database/AbstractDataLoader";

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
        const employees = await employeeDB.getEmployeesOfCompanies({
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
