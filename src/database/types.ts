import { UUID } from "~/models";

export enum Table {
  USERS = "users",
  EMPLOYEE = "employee",
  COMPANY = "company",
  PERSONS = "person",
}

export const tableColumn = <T extends Tables>(table: Table, column: keyof T) =>
  [table, column].join(".");

type Tables =
  | UserTableRaw
  | CompanyTableRaw
  | PersonTableRaw
  | EmployeeTableRaw;

export type UserTableRaw = Readonly<{
  id: number;
  uuid: UUID;
  username: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type CompanyTableRaw = Readonly<{
  id: number;
  uuid: UUID;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type PersonTableRaw = Readonly<{
  id: number;
  uuid: UUID;
  firstName: string;
  lastName: string;
  personalIdentityCode: string;
  phone: string;
  email: string;
  nationality: string;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type EmployeeTableRaw = Readonly<{
  id: number;
  companyId: number;
  personId: number;
  createdAt: Date;
}>;
