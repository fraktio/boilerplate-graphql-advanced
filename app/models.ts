import { CompanyTable } from "./database/companyDB";
import { PersonTable } from "./database/personDB";

import { Adult, Company, Person } from "~/generated/graphql";

export interface UUID extends String {
  _UUID: never;
}

export type CompanyModel = Omit<Company, "employees"> &
  Pick<CompanyTable, "id">;

export type PersonModel = Omit<Person, "languages"> & Pick<PersonTable, "id">;

export type AdultModel = Omit<Adult, "languages" | "employers"> &
  Pick<PersonTable, "id">;
