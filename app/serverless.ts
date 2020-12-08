import serverless from "serverless-http";

import { getConfigFromEnv } from "./config";
import { createServer } from "./server";

const config = getConfigFromEnv();

const { app, knex } = createServer({ config });

process.on("SIGINT", () => {
  knex.destroy();
});

export const graphqlHandler = serverless(app);
