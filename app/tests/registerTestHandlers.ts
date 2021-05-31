import { DBConnection } from "~/database/connection";
import { migrateTestDatabase, resetTestDatabase } from "~/tests/testDatabase";

export const registerTestHandlers = (params: { knex: DBConnection }): void => {
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
