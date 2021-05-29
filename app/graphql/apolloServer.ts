import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import responseCachePlugin from "apollo-server-plugin-response-cache";

import { Config } from "~/config/config";
import { createDataSources } from "~/dataSources";
import { apolloErrorHandler } from "~/express/middleware/errorHandler";
import { createExecutableSchema } from "~/graphql/schema";
import { createValidationRules } from "~/graphql/validationRules";
import { apolloServerLogger } from "~/logger";

type CreateServerOpts = ApolloServerExpressConfig & {
  config: Config;
};

export const createApolloServer = (opts: CreateServerOpts): ApolloServer =>
  new ApolloServer({
    validationRules: createValidationRules(),
    schema: createExecutableSchema(),
    formatError: apolloErrorHandler({ config: opts.config }),
    plugins: [apolloServerLogger, responseCachePlugin()],
    introspection: !opts.config.env.isProduction,
    dataSources: createDataSources,
    playground: opts.config.env.isProduction
      ? false
      : { settings: { "request.credentials": "include" } },
    ...opts,
  });
