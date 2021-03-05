import { DateTime } from "luxon";

import { Table } from "~/database/base";
import { CompanyID } from "~/database/companyDB";
import { DBConnection } from "~/database/connection";
import { EmployeeID, EmployeeTableRow } from "~/database/employeeDB";
import { PersonID } from "~/database/personDB";

type EmployeeTable = {
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

export const employeeDS = {
  async create(params: {
    knex: DBConnection;
    companyId: CompanyID;
    personId: PersonID;
  }) {
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
  }) {
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
