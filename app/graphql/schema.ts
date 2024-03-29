import {
  makeExecutableSchema,
  IExecutableSchemaDefinition,
} from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";

import { applyDirectivestToSchema } from "~/graphql/directives/directives";
import { resolvers } from "~/graphql/resolvers/resolvers";
import { typeDefs } from "~/graphql/typeDefs";

export const createSchema = (
  opts?: Partial<IExecutableSchemaDefinition>,
): IExecutableSchemaDefinition => ({
  inheritResolversFromInterfaces: true,
  resolverValidationOptions: {
    requireResolversForAllFields: "ignore",
    requireResolversForResolveType: "ignore",
    requireResolversToMatchSchema: "warn",
  },
  resolvers,
  typeDefs,
  ...opts,
});

export const createExecutableSchema = (
  opts?: Partial<IExecutableSchemaDefinition>,
): GraphQLSchema =>
  applyDirectivestToSchema(makeExecutableSchema(createSchema(opts)));
