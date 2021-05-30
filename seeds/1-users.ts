import faker from "faker";
import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

import { Table } from "~/database/tables";
import { UserTableRow } from "~/database/user/userQueries";
import { hashingUtils } from "~/utils/hashingUtils";

export const testUsername = "username";
export const testPassword = "password";

export const doXTimes = (count: number): number[] => [...Array(count).keys()];

type CreateUser = {
  uuid: string;
  username: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
};

const createUser = (opts: {
  username?: string;
  password: string;
}): CreateUser => ({
  uuid: uuidv4(),
  username: opts?.username || faker.internet.userName(),
  email: faker.internet.email(),
  phoneNumber: faker.phone.phoneNumber(),
  hashedPassword: opts.password,
});

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Table.USERS).del();

  const password = await hashingUtils.hashPassword({
    password: testPassword,
  });

  const users = [
    createUser({ username: testUsername, password }),
    ...doXTimes(125).map(() => createUser({ password })),
  ];

  await knex(Table.USERS).insert<UserTableRow>(users);
};
