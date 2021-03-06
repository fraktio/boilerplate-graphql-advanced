import {
  IResolverValidationOptions,
  makeExecutableSchema,
  IExecutableSchemaDefinition,
} from "apollo-server-express";
import { GraphQLSchema } from "graphql";

import { createSchemaDirectives } from "~/graphql/directives/directives";
import { resolvers } from "~/graphql/resolvers/resolvers";
import { typeDefs } from "~/graphql/typeDefs";

export const createResolverValidationOptions = (
  behaviour: boolean,
): IResolverValidationOptions => ({
  requireResolversForArgs: behaviour,
  requireResolversForResolveType: behaviour,
  allowResolversNotInSchema: behaviour,
});

export const createSchema = (
  opts?: Partial<IExecutableSchemaDefinition>,
): IExecutableSchemaDefinition => ({
  allowUndefinedInResolve: false,
  inheritResolversFromInterfaces: true,
  resolverValidationOptions: createResolverValidationOptions(true),
  resolvers,
  typeDefs,
  schemaDirectives: createSchemaDirectives(),
  ...opts,
});

export const createExecutableSchema = (
  opts?: Partial<IExecutableSchemaDefinition>,
): GraphQLSchema => makeExecutableSchema(createSchema(opts));
