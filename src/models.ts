import { Adult, Company, Person } from "./generated/graphql";

export type CompanyModel = Omit<Company, "employees">;

export type PersonModel = Omit<Person, "languages">;

export type AdultModel = Omit<Adult, "languages" | "employers">;

export interface UUID extends String {
  _UUID: never;
}
