import { getConfigFromEnv } from "~/config";
import { createServer } from "~/server";

const config = getConfigFromEnv();

const { app, logger } = createServer({ config });

app.listen({ port: config.apiPort }, () => {
  logger.info(`🚀 Server ready, listening on port ${config.apiPort}`);
});
