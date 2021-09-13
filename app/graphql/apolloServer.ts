import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import { Server } from "http";

import { Config } from "~/config/config";
import { createDataSources } from "~/dataSources";
import { apolloErrorHandler } from "~/express/middleware/errorHandler";
import { createPlugins } from "~/graphql/plugins/plugins";
import { createExecutableSchema } from "~/graphql/schema";
import { createValidationRules } from "~/graphql/validationRules";

type CreateServerOpts = ApolloServerExpressConfig & {
  config: Config;
  httpServer: Server;
};

export const createApolloServer = ({
  config,
  httpServer,
  ...rest
}: CreateServerOpts): ApolloServer => {
  const schema = createExecutableSchema();

  return new ApolloServer({
    validationRules: createValidationRules(),
    schema,
    formatError: apolloErrorHandler({ config }),
    plugins: createPlugins({
      graphqlConfig: config.graphql,
      schema,
      httpServer,
    }),
    introspection: config.graphql.allowIntrospection,
    dataSources: createDataSources,
    persistedQueries: { ttl: 43200 /* 12h */ },
    ...rest,
  });
};
