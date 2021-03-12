import serverless from "serverless-http";

import { getConfigFromEnv } from "~/config";
import { createServer } from "~/server";

export const graphqlHandler = async () => {
  const config = await getConfigFromEnv();

  const { app, knex } = createServer({ config });

  process.on("SIGINT", () => {
    knex.destroy();
  });

  return serverless(app);
};
