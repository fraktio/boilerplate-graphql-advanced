import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";

import { Config } from "~/config/config";
import { createDataSources } from "~/dataSources";
import { apolloErrorHandler } from "~/express/middleware/errorHandler";
import { createPlugins } from "~/graphql/plugins/plugins";
import { createExecutableSchema } from "~/graphql/schema";
import { createValidationRules } from "~/graphql/validationRules";

type CreateServerOpts = ApolloServerExpressConfig & {
  config: Config;
};

export const createApolloServer = ({
  config,
  ...rest
}: CreateServerOpts): ApolloServer =>
  new ApolloServer({
    validationRules: createValidationRules(),
    schema: createExecutableSchema(),
    formatError: apolloErrorHandler({ config }),
    plugins: createPlugins({ graphqlConfig: config.graphql }),
    introspection: config.graphql.allowIntrospection,
    dataSources: createDataSources,
    persistedQueries: { ttl: 43200 /* 12h */ },
    ...rest,
  });
