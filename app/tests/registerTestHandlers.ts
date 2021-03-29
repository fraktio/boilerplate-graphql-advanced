import { migrateTestDatabase, resetTestDatabase } from "./testDatabase";

import { DBConnection } from "~/database/connection";

export const registerTestHandlers = (params: { knex: DBConnection }) => {
  beforeAll(async () => {
    await migrateTestDatabase({ knex: params.knex });
  });

  beforeEach(async () => {
    await resetTestDatabase({ knex: params.knex });
  });

  afterAll(async () => {
    await params.knex.destroy();
  });
};
