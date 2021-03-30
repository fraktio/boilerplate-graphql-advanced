import { Knex } from "knex";

import { Table } from "../app/database/tables";
import { UserTableRow } from "../app/database/user/userDatabase";
import {
  createUser,
  doXTimes,
  testPassword,
  testUsername,
} from "../app/tests/testData";
import { createDatabaseUser } from "../app/tests/testDatabase";
import { hashingUtils } from "../app/utils/hashingUtils";

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Table.USERS).del();

  const hashedPassword = await hashingUtils.hashPassword({
    password: testPassword,
  });

  const demoUser = await createDatabaseUser({
    knex,
    overrides: createUser({
      username: testUsername,
      hashedPassword,
    }),
  });
  const fillerUsers = doXTimes(125).map(() => createUser({ hashedPassword }));

  const users = [demoUser, ...fillerUsers];

  await knex(Table.USERS).insert<UserTableRow>(users);
};
