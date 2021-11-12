import { ApolloServer, ExpressContext } from "apollo-server-express";
import { Express } from "express";
import { graphqlUploadExpress } from "graphql-upload";
import { Server, createServer as createHttpServer } from "http";

import { Config } from "~/config/config";
import { createKnex, DBSession } from "~/database/connection";
import { createExpress } from "~/express/express";
import { devFrontendProxy } from "~/express/middleware/devFrontendProxy";
import { errorHandler } from "~/express/middleware/errorHandler";
import { createLoggerMiddleware } from "~/express/middleware/loggerHandler";
import { sessionHandler } from "~/express/middleware/sessionHandler";
import { createRoutes } from "~/express/routes/routes";
import { createApolloServer } from "~/graphql/apolloServer";
import { createContext } from "~/graphql/context";
import { createLogger, Logger } from "~/logger";
import { createRedis } from "~/redis";

export type ServerContext = {
  app: Express;
  logger: Logger;
  knex: DBSession;
  config: Config;
  apolloServer: ApolloServer<ExpressContext>;
};

export type StartServerFunction = () => Promise<StartServerResponse>;

export type CreateServerResponse = ServerContext & {
  startServer: StartServerFunction;
};

export type StartServerResponse = ServerContext & {
  server: Server;
};

type CreateSercerFunction = (params: {
  config: Config;
}) => CreateServerResponse;

export const createServer: CreateSercerFunction = ({ config }) => {
  const logger = createLogger({
    loggingConfig: config.logging,
    platformConfig: config.platform,
  });

  const knex = createKnex({
    databaseConfig: config.database,
    logger,
    platformConfig: config.platform,
    debug: config.database.knex.debug,
  });

  const redisCache = config.redis.useRedis
    ? createRedis({ redisConfig: config.redis, logger })
    : undefined;

  const app = createExpress({ config, knex });

  app.use(graphqlUploadExpress());
  app.use(createLoggerMiddleware({ logger, platformConfig: config.platform }));
  app.use(sessionHandler({ sessionConfig: config.session, knex }));
  app.use(createRoutes({ knex, loggingConfig: config.logging }));

  const context = createContext({ knex, config });
  const httpServer = createHttpServer(app);
  const apolloServer = createApolloServer({
    config,
    context,
    httpServer,
    cache: redisCache,
  });

  async function startServer(): Promise<StartServerResponse> {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });

    if (!config.env.isProduction) {
      app.use(devFrontendProxy());
    }

    if (config.env.isProduction) {
      app.use(errorHandler);
    }

    return await new Promise((resolve) => {
      const server = httpServer.listen({ port: config.env.apiPort }, () => {
        resolve({ app, logger, knex, config, apolloServer, server });
      });
    });
  }

  return { app, logger, knex, config, apolloServer, startServer };
};
