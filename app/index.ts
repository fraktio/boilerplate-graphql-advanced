import { createConfig } from "~/config/config";
import { testDbConnection } from "~/database/connection";
import { createServer } from "~/server";

const config = createConfig();

const { startServer } = createServer({ config });

startServer().then(async ({ logger, knex, apolloServer, server }) => {
  const closeAll = (): void => {
    server.close();
    knex.destroy();
    apolloServer.stop();
    process.exit();
  };

  process.on("SIGTERM", () => {
    logger.error("Received SIGTERM");
    closeAll();
  });

  process.on("SIGTERM", () => {
    server.close();
  });

  process.on("SIGINT", () => {
    server.close();
  });

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
