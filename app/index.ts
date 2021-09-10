import { createConfig } from "~/config/config";
import { testDbConnection } from "~/database/connection";
import { createServer } from "~/server";

const config = createConfig();

const { logger, knex, apolloServer, startServer } = createServer({ config });

const closeAll = (): void => {
  knex.destroy();
  apolloServer.stop();
};

process.on("SIGTERM", () => {
  logger.error("Received SIGTERM");
  closeAll();
});

process.on("SIGINT", closeAll);

startServer().then(async () => {
  logger.info(`🚀 Server ready, listening on port ${config.env.apiPort}`);

  const result = await testDbConnection({
    dbConnection: knex,
  });

  if (!result.success) {
    logger.error("Database connection test failed", result.failure);
    closeAll();
    process.exit(1);
  }

  logger.info("🎉 Database connection success");
});
