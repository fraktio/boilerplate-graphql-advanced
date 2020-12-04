import faker from "faker";
import * as Knex from "knex";
import { v4 as uuidv4 } from "uuid";

import { UserTable } from "../src/dataSources/UserDataSource";
import { Table } from "../src/database/types";

import { HashingUtils } from "~/utils/hashingUtils";

const hashingUtils = new HashingUtils();

export const seed = async (knex: Knex): Promise<void> => {
  // Deletes ALL existing entries
  await knex(Table.USERS).del();

  [...Array(125).keys()].forEach(async () => {
    const username = faker.internet.userName();

    await knex(Table.USERS).insert<UserTable>([
      {
        uuid: uuidv4(),
        username,
        email: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber(),
        hashedPassword: await hashingUtils.hashPassword({
          password: "password",
        }),
      },
    ]);
  });
};
