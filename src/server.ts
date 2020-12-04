import { createProxyMiddleware } from "http-proxy-middleware";

import { Config } from "~/config";
import { createDataSources } from "~/dataSources/dataSources";
import { createKnex } from "~/database/connection";
import { createExpress } from "~/express";
import { createApolloServer } from "~/graphql/apolloServer";
import { createContext } from "~/graphql/context";
import { createLogger } from "~/logger";
import { errorHandler } from "~/middleware/errorHandler";
import { loggerHandler } from "~/middleware/loggerHandler";
import { sessionHandler } from "~/middleware/sessionHandler";
import { createServices } from "~/services/services";

export const createServer = ({ config }: { config: Config }) => {
  const logger = createLogger({ config });
  const knex = createKnex({ config });
  const services = createServices({ config, logger });
  const dataSources = createDataSources({ config, logger, knex });

  const app = createExpress({ config });
  app.use(loggerHandler({ logger }));
  app.use(
    sessionHandler({
      config,
      sessionService: services.sessionService,
      userDataSource: dataSources.userDS,
    }),
  );

  const apolloServer = createApolloServer({
    config,
    context: createContext({ services }),
    dataSources: () => dataSources,
  });

  apolloServer.applyMiddleware({ app, cors: false });
  if (config.isProduction) {
    // Used for proxy for cookies to work on certain endpoints
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        changeOrigin: true,
      }),
    );
  }

  if (config.isProduction) {
    app.use(errorHandler);
  }

  return { app, logger };
};
