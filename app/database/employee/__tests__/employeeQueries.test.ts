import { CompanyID } from "~/database/company/companyQueries";
import {
  EmployeeID,
  EmployeeTable,
  EmployeeTableRow,
  formatEmployeeRow,
} from "~/database/employee/employeeQueries";
import { PersonID } from "~/database/person/personQueries";

const datatimeString =
  "Fri Mar 12 2021 13:16:56 GMT+0200 (Eastern European Standard Time)";

export const dbEmployeeMockTableRow: EmployeeTableRow = {
  id: 2 as unknown as EmployeeID,
  companyId: 3 as unknown as CompanyID,
  personId: 5 as unknown as PersonID,
  createdAt: new Date(datatimeString),
};

export const createFakeEmployeeTable = (): EmployeeTable =>
  formatEmployeeRow(dbEmployeeMockTableRow);

describe("database tests / employee", () => {
  it("formatEmployeeRow", async () => {
    const result = formatEmployeeRow(dbEmployeeMockTableRow);

    expect(result).toMatchSnapshot();
  });
});
