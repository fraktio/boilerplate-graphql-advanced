import { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { Config } from "~/config/config";
import { createKnex, DBConnection } from "~/database/connection";
import { createExpress } from "~/express/express";
import { errorHandler } from "~/express/middleware/errorHandler";
import { loggerHandler } from "~/express/middleware/loggerHandler";
import { sessionHandler } from "~/express/middleware/sessionHandler";
import { createRoutes } from "~/express/routes/routes";
import { createApolloServer } from "~/graphql/apolloServer";
import { createContext } from "~/graphql/context";
import { createLogger, Logger } from "~/logger";

export type CreateServerResponse = {
  app: Express;
  logger: Logger;
  knex: DBConnection;
  config: Config;
};

type CreateSercerFunction = (params: {
  config: Config;
}) => CreateServerResponse;

export const createServer: CreateSercerFunction = ({ config }) => {
  const logger = createLogger({ config });

  const knex = createKnex({ databaseConfig: config.database, logger });
  const app = createExpress({ config, knex });

  app.use(loggerHandler({ logger }));
  app.use(createRoutes({ knex }));
  app.use(sessionHandler({ cookiesConfig: config.cookies, knex }));

  const apolloServer = createApolloServer({
    config,
    context: createContext({ knex, config }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  if (!config.env.isProduction) {
    // Used for proxy for cookies to work on certain endpoints
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        changeOrigin: true,
      }),
    );
  }

  if (config.env.isProduction) {
    app.use(errorHandler);
  }

  return { app, logger, knex, config };
};
