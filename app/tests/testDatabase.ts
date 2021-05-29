import { PhoneNumber } from "libphonenumber-js";

import { createCompany, createUser, testPassword } from "./testData";

import {
  companyDB,
  CompanyTable,
  CreateCompanyParams,
} from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import { Table } from "~/database/tables";
import { userDB, UserTable } from "~/database/user/userDatabase";
import { EmailAddress } from "~/generation/scalars";
import { hashingUtils } from "~/utils/hashingUtils";

export const migrateTestDatabase = async (params: {
  knex: DBConnection;
}): Promise<void> => {
  await params.knex.migrate.latest();
};
export const resetTestDatabase = async ({
  knex,
}: {
  knex: DBConnection;
}): Promise<void> => {
  await knex(Table.EMPLOYEE).del();
  await knex(Table.PERSONS).del();
  await knex(Table.COMPANY).del();
  await knex(Table.USERS).del();
};

type CreateDBUserOver = {
  username: string;
  email: EmailAddress;
  password: string;
  phoneNumber: PhoneNumber;
};

export const createDatabaseUser = async (params: {
  knex: DBConnection;
  overrides?: Partial<CreateDBUserOver>;
}): Promise<UserTable> => {
  const hashedPassword = await hashingUtils.hashPassword({
    password: params.overrides?.password ?? testPassword,
  });

  const mockUser = createUser({ hashedPassword });
  const newUser = {
    username: params.overrides?.username ?? mockUser.username,
    email: params.overrides?.email ?? mockUser.email,
    hashedPassword,
    phoneNumber: params.overrides?.phoneNumber ?? mockUser.phoneNumber,
  };

  return await userDB.create({
    knex: params.knex,
    newUser,
  });
};

export const createDatabaseCompany = async (params: {
  knex: DBConnection;
  overrides: Partial<CreateCompanyParams>;
}): Promise<CompanyTable> => {
  const company = createCompany();

  return await companyDB.create({
    knex: params.knex,
    company: { name: params.overrides.name ?? company.name },
  });
};
