import { DateTime } from "luxon";

import { CompanyID } from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import { PersonID } from "~/database/person/personDatabase";
import { ID, Table } from "~/database/tables";

export interface EmployeeID extends ID {
  __EmployeeID: never;
}

export type EmployeeTableRow = Readonly<{
  id: EmployeeID;
  companyId: CompanyID;
  personId: PersonID;
  createdAt: Date;
}>;

export type EmployeeTable = {
  id: EmployeeID;
  companyId: CompanyID;
  personId: PersonID;
  timestamp: {
    createdAt: DateTime;
    updatedAt: null;
  };
};

export const formatEmployeeRow = (row: EmployeeTableRow): EmployeeTable => ({
  id: row.id,
  companyId: row.companyId,
  personId: row.personId,
  timestamp: {
    createdAt: DateTime.fromJSDate(row.createdAt),
    updatedAt: null,
  },
});

export const employeeDB = {
  async create(params: {
    knex: DBConnection;
    companyId: CompanyID;
    personId: PersonID;
  }): Promise<EmployeeTable> {
    const employee = await params
      .knex<EmployeeTableRow>(Table.EMPLOYEE)
      .insert({
        companyId: params.companyId,
        personId: params.personId,
      })
      .returning("*")
      .first();

    if (!employee) {
      throw new Error("Could not insert employee");
    }

    return formatEmployeeRow(employee);
  },

  async remove(params: {
    knex: DBConnection;
    companyId: CompanyID;
    personId: PersonID;
  }): Promise<boolean> {
    const count = await params
      .knex<EmployeeTableRow>(Table.EMPLOYEE)
      .where({
        companyId: params.companyId,
        personId: params.personId,
      })
      .del();

    return count > 0;
  },
};
