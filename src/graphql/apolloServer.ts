import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import { GraphQLSchema } from "graphql";
import depthLimit from "graphql-depth-limit";
import { makeExecutableSchema } from "graphql-tools";
import { createComplexityLimitRule } from "graphql-validation-complexity";

import { createSchemaDirectives } from "./directives/directives";

import { Config } from "~/config";
import { resolvers } from "~/graphql/resolvers";
import { typeDefs } from "~/graphql/typeDefs";
import { apolloServerLogger } from "~/logger";
import { apolloErrorHandler } from "~/middleware/errorHandler";

const createValidationRules = () => [
  depthLimit(6),
  createComplexityLimitRule(1000000000, {
    scalarCost: 2,
    objectCost: 10,
    listFactor: 20,
  }),
];

export const createSchema = (): GraphQLSchema =>
  makeExecutableSchema({
    allowUndefinedInResolve: false,
    inheritResolversFromInterfaces: true,
    resolverValidationOptions: {
      requireResolversForArgs: true,
      requireResolversForResolveType: true,
    },
    resolvers,
    typeDefs,
    schemaDirectives: createSchemaDirectives(),
  });

type CreateServerOpts = ApolloServerExpressConfig & {
  config: Config;
};

export const createApolloServer = (opts: CreateServerOpts) =>
  new ApolloServer({
    validationRules: createValidationRules(),
    schema: createSchema(),
    formatError: apolloErrorHandler({ config: opts.config }),
    plugins: [apolloServerLogger, responseCachePlugin()],
    playground: {
      settings: { "request.credentials": "include" },
    },
    ...opts,
  });
