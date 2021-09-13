import { createConfig } from "~/config/config";
import { testDbConnection } from "~/database/connection";
import { createServer } from "~/server";

const config = createConfig();

const { startServer } = createServer({ config });

startServer().then(async ({ logger, knex, apolloServer, server }) => {
  const createCloseAll = (name: string) => (): void => {
    logger.info(`Received ${name}`);
    server.close();
    knex.destroy();
    apolloServer.stop();
    process.exit();
  };

  process.on("SIGTERM", createCloseAll("SIGTERM"));
  process.on("SIGINT", createCloseAll("SIGINT"));

  logger.info(`🚀 Server ready, listening on port ${config.env.apiPort}`);

  const result = await testDbConnection({
    dbConnection: knex,
  });

  if (!result.success) {
    logger.error("Database connection test failed", result.failure);
    createCloseAll("Couldn't connect to database, closing server");
    process.exit(1);
  }

  logger.info("🎉 Database connection success");
});
