import { CompanyID } from "~/dataSources/company/companyDatabase";
import { employeeDB } from "~/dataSources/employee/employeeDatabase";
import { PersonID } from "~/dataSources/person/personDatabase";
import { DBConnection } from "~/database/connection";

export const employeeDS = {
  async create(params: {
    knex: DBConnection;
    companyId: CompanyID;
    personId: PersonID;
  }) {
    return await employeeDB.create(params);
  },

  async remove(params: {
    knex: DBConnection;
    companyId: CompanyID;
    personId: PersonID;
  }) {
    return await employeeDB.remove(params);
  },
};
