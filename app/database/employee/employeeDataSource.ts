import { CompanyID } from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import {
  employeeDB,
  EmployeeTable,
} from "~/database/employee/employeeDatabase";
import { PersonID } from "~/database/person/personDatabase";

export const employeeDS = {
  async create(params: {
    knex: DBConnection;
    companyId: CompanyID;
    personId: PersonID;
  }): Promise<EmployeeTable> {
    return await employeeDB.create(params);
  },

  async remove(params: {
    knex: DBConnection;
    companyId: CompanyID;
    personId: PersonID;
  }): Promise<boolean> {
    return await employeeDB.remove(params);
  },
};
