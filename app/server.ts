import { Express } from "express";

import { Config } from "~/config/config";
import { createKnex, DBSession } from "~/database/connection";
import { createExpress } from "~/express/express";
import { devFrontendProxy } from "~/express/middleware/devFrontendProxy";
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
  knex: DBSession;
  config: Config;
};

type CreateSercerFunction = (params: {
  config: Config;
}) => CreateServerResponse;

export const createServer: CreateSercerFunction = ({ config }) => {
  const logger = createLogger({ config });

  const knex = createKnex({ databaseConfig: config.database });
  const app = createExpress({ config, knex });

  app.use(loggerHandler({ logger }));
  app.use(createRoutes({ knex, loggingConfig: config.logging }));
  app.use(sessionHandler({ cookiesConfig: config.cookies, knex }));

  const context = createContext({ knex, config });
  const apolloServer = createApolloServer({ config, context });

  apolloServer.applyMiddleware({ app, cors: false });

  if (!config.env.isProduction) {
    app.use(devFrontendProxy());
  }

  if (config.env.isProduction) {
    app.use(errorHandler);
  }

  return { app, logger, knex, config };
};
