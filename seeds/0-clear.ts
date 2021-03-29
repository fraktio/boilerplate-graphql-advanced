import { Knex } from "knex";

import { resetTestDatabase } from "~/tests/testDatabase";

export const seed = async (knex: Knex): Promise<void> => {
  await resetTestDatabase({ knex });
};
