import { StartServerFunction, StartServerResponse } from "~/server";
import {
  nukeDatabase,
  migrateTestDatabase,
  resetTestDatabase,
} from "~/tests/testDatabase";

export const registerTestHandlers = (params: {
  startServer: StartServerFunction;
}): void => {
  let serverOpts: StartServerResponse = null as unknown as StartServerResponse;

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    serverOpts = await params.startServer();
    if (process.argv.filter((x) => x.startsWith("--reInitializeDb"))[0]) {
      await nukeDatabase({ knex: serverOpts.knex });
    }
    await migrateTestDatabase({ knex: serverOpts.knex });
  });

  beforeEach(async () => {
    if (!serverOpts) {
      return;
    }
    await resetTestDatabase({ knex: serverOpts.knex });
  });

  afterAll(async () => {
    if (!serverOpts) {
      return;
    }

    await serverOpts.apolloServer.stop();
    await serverOpts.knex.destroy();
    serverOpts.server.close();
  });
};
