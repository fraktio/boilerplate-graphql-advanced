import { Adult, Company, Person } from "~/generated/graphql";

export interface CompanyModel extends Omit<Company, "employees"> {
  id: number;
}

export interface PersonModel extends Omit<Person, "languages"> {
  id: number;
}

export interface AdultModel extends Omit<Adult, "languages" | "employers"> {
  id: number;
}

export interface UUID extends String {
  _UUID: never;
}
