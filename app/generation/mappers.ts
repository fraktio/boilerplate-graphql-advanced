import { CompanyTable } from "~/database/company/companyQueries";
import { PersonTable } from "~/database/person/personQueries";
import { UserTable } from "~/database/user/userQueries";
import { Adult, Company, Person, User } from "~/generation/generated";

export interface UUID extends String {
  _UUID: never;
}

export type UserModel = User & Pick<UserTable, "id">;

export type CompanyModel = Omit<Company, "employees"> &
  Pick<CompanyTable, "id">;

export type PersonModel = Omit<Person, "languages"> & Pick<PersonTable, "id">;

export type AdultModel = Omit<Adult, "languages" | "employers"> &
  Pick<PersonTable, "id">;
