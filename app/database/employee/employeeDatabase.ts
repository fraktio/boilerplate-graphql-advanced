import { CompanyID } from "~/database/company/companyQueries";
import { DBSession } from "~/database/connection";
import {
  employeeQueries,
  EmployeeTable,
} from "~/database/employee/employeeQueries";
import { PersonID } from "~/database/person/personQueries";

export const employeeDB = {
  async create(params: {
    knex: DBSession;
    companyId: CompanyID;
    personId: PersonID;
  }): Promise<EmployeeTable> {
    return await employeeQueries.create(params);
  },

  async remove(params: {
    knex: DBSession;
    companyId: CompanyID;
    personId: PersonID;
  }): Promise<boolean> {
    return await employeeQueries.remove(params);
  },
};
