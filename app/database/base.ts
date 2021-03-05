export enum Table {
  USERS = "users",
  EMPLOYEE = "employee",
  COMPANY = "company",
  PERSONS = "person",
}

export interface ID extends Number {
  _ID: never;
}
