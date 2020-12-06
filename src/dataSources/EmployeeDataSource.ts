import { DateTime } from "luxon";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import { Table, EmployeeTableRaw } from "~/database/types";

type EmployeeTable = {
  id: number;
  companyId: number;
  personId: number;
  timestamp: {
    createdAt: DateTime;
    updatedAt: null;
  };
};

export class EmployeeDataSource extends DataSourceWithContext {
  private formatRow(row: EmployeeTableRaw): EmployeeTable {
    return {
      id: row.id,
      companyId: row.companyId,
      personId: row.personId,
      timestamp: {
        createdAt: DateTime.fromJSDate(row.createdAt),
        updatedAt: null,
      },
    };
  }

  public async createEmployee(opts: { companyId: number; personId: number }) {
    const employee = await this.knex<EmployeeTableRaw>(Table.EMPLOYEE)
      .insert(opts)
      .returning("*")
      .first();

    if (!employee) {
      throw new Error("Could not insert employee");
    }

    return this.formatRow(employee);
  }

  public async removeEmployee(opts: { companyId: number; personId: number }) {
    const count = await this.knex<EmployeeTableRaw>(Table.EMPLOYEE)
      .where(opts)
      .del();

    return count > 0;
  }
}
