import { v4 as uuidv4 } from "uuid";

import { CompanyTableRow } from "../dataSources/company/companyDatabase";
import { EmployeeTableRow } from "../dataSources/employee/employeeDatabase";
import { PersonTableRow } from "../dataSources/person/personDatabase";
import { UserTableRow } from "../dataSources/user/userDatabase";

import { Table } from "./base";

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

export const tableColumn = <T extends Table>(
  table: T,
  column: keyof TableColumns<T>,
) => [table, column].join(".");

export type Tables =
  | UserTableRow
  | CompanyTableRow
  | EmployeeTableRow
  | PersonTableRow;
