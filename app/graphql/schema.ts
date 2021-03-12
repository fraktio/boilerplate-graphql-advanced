import {
  makeExecutableSchema,
  IExecutableSchemaDefinition,
} from "apollo-server-express";
import { GraphQLSchema } from "graphql";

import { createSchemaDirectives } from "~/graphql/directives/directives";
import { resolvers } from "~/graphql/resolvers/resolvers";
import { typeDefs } from "~/graphql/typeDefs";

export const createSchema = (
  opts?: Partial<IExecutableSchemaDefinition>,
): IExecutableSchemaDefinition => ({
  allowUndefinedInResolve: false,
  inheritResolversFromInterfaces: true,
  resolverValidationOptions: {
    requireResolversForArgs: true,
    requireResolversForResolveType: true,
    allowResolversNotInSchema: true,
  },
  resolvers,
  typeDefs,
  schemaDirectives: createSchemaDirectives(),
  ...opts,
});

export const createExecutableSchema = (
  opts?: Partial<IExecutableSchemaDefinition>,
): GraphQLSchema => makeExecutableSchema(createSchema(opts));
