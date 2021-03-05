import { v4 as uuidv4 } from "uuid";

import { Table } from "./base";
import { CompanyTableRow } from "./companyDB";
import { EmployeeTableRow } from "./employeeDB";
import { PersonTableRow } from "./personDB";
import { UserTableRow } from "./userDB";

import { UUID } from "~/models";

export const createUUID = () => (uuidv4() as unknown) as UUID;

type TableColumns<T extends Table> = T extends Table.USERS
  ? UserTableRow
  : T extends Table.COMPANY
  ? CompanyTableRow
  : T extends Table.EMPLOYEE
  ? EmployeeTableRow
  : T extends Table.PERSONS
  ? PersonTableRow
  : never;

export const tableColumn = (table: Table, column: keyof TableColumns<Table>) =>
  [table, column].join(".");

export type Tables =
  | UserTableRow
  | CompanyTableRow
  | EmployeeTableRow
  | PersonTableRow;
