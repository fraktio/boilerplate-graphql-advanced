import { v4 as uuidv4 } from "uuid";

import { CompanyTableRow } from "~/database/company/companyQueries";
import { EmployeeTableRow } from "~/database/employee/employeeQueries";
import { PersonTableRow } from "~/database/person/personQueries";
import { UserTableRow } from "~/database/user/userQueries";
import { UUID } from "~/generation/mappers";

export enum Table {
  USERS = "users",
  EMPLOYEE = "employee",
  COMPANY = "company",
  PERSONS = "person",
  KNEX_MIGRATIONS = "knex_migrations",
  KNEX_MIGRATIONS_LOCK = "knex_migrations_lock",
}

export interface ID extends Number {
  _ID: never;
}

export const createUUID = (): UUID => uuidv4() as unknown as UUID;

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
): string => [table, column].join(".");

export type Tables =
  | UserTableRow
  | CompanyTableRow
  | EmployeeTableRow
  | PersonTableRow;
