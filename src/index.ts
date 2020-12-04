import { getConfigFromEnv } from "~/config";
import { createServer } from "~/server";

const config = getConfigFromEnv();

const { app, logger, knex } = createServer({ config });

const server = app.listen({ port: config.apiPort }, () => {
  logger.info(`🚀 Server ready, listening on port ${config.apiPort}`);
});

process.on("SIGINT", () => {
  knex.destroy();
  server.close();
});
