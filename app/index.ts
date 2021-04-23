import { createConfig } from "~/config/config";
import { createServer } from "~/server";

const config = createConfig();

const { app, logger, knex } = createServer({ config });

const server = app.listen({ port: config.env.apiPort }, () => {
  logger.info(`🚀 Server ready, listening on port ${config.env.apiPort}`);
});

process.on("SIGINT", () => {
  knex.destroy();
  server.close();
});
