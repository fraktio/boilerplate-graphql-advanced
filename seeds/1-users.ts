import faker from "faker";
import * as Knex from "knex";
import { v4 as uuidv4 } from "uuid";

import { Table } from "~/database/base";
import { UserTableRow } from "~/database/userDB";
import { hashingUtils } from "~/utils/hashingUtils";

export const doXTimes = (count: number) => [...Array(count).keys()];

const createUser = (opts: { username?: string; password: string }) => ({
  uuid: uuidv4(),
  username: opts?.username || faker.internet.userName(),
  email: faker.internet.email(),
  phoneNumber: faker.phone.phoneNumber(),
  hashedPassword: opts.password,
});

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Table.USERS).del();

  const password = await hashingUtils.hashPassword({
    password: "password",
  });

  const users = [
    createUser({ username: "username", password }),
    ...doXTimes(125).map(() => createUser({ password })),
  ];

  await knex(Table.USERS).insert<UserTableRow>(users);
};
