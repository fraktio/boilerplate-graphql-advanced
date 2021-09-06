import { createConfig } from "~/config/config";
import { testDbConnection } from "~/database/connection";
import { createServer } from "~/server";

const config = createConfig();

const { app, logger, knex } = createServer({ config });

const closeAll = (): void => {
  knex.destroy();
  server.close();
};

const server = app.listen({ port: config.env.apiPort }, async () => {
  const result = await testDbConnection({
    dbConnection: knex,
  });

  if (!result.success) {
    logger.error("Database connection test failed", result.failure);
    closeAll();
    process.exit(1);
  }

  logger.info("🎉 Database connection success");
  logger.info(`🚀 Server ready, listening on port ${config.env.apiPort}`);
});

process.on("SIGTERM", () => {
  logger.error("Received SIGTERM");
  closeAll();
});

process.on("SIGINT", closeAll);
