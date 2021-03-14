import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import responseCachePlugin from "apollo-server-plugin-response-cache";

import { Config } from "~/config";
import { apolloErrorHandler } from "~/express/middleware/errorHandler";
import { createExecutableSchema } from "~/graphql/schema";
import { createValidationRules } from "~/graphql/validationRules";
import { apolloServerLogger } from "~/logger";

type CreateServerOpts = ApolloServerExpressConfig & {
  config: Config;
};

export const createApolloServer = (opts: CreateServerOpts) =>
  new ApolloServer({
    validationRules: createValidationRules(),
    schema: createExecutableSchema(),
    formatError: apolloErrorHandler({ config: opts.config }),
    plugins: [apolloServerLogger, responseCachePlugin()],
    introspection: !opts.config.isProduction,
    playground: opts.config.isProduction
      ? false
      : { settings: { "request.credentials": "include" } },
    ...opts,
  });
