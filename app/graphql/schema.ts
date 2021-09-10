import {
  makeExecutableSchema,
  IExecutableSchemaDefinition,
} from "@graphql-tools/schema";
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
    requireResolversForAllFields: "ignore",
    requireResolversForResolveType: "warn",
    requireResolversToMatchSchema: "warn",
  },
  resolvers,
  typeDefs,
  schemaDirectives: createSchemaDirectives(),
  ...opts,
});

export const createExecutableSchema = (
  opts?: Partial<IExecutableSchemaDefinition>,
): GraphQLSchema => makeExecutableSchema(createSchema(opts));
