import { AuthenticationError } from "apollo-server-express";
import { defaultFieldResolver, GraphQLField } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";

import { Context } from "~/graphql/context";

export class AuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<unknown, Context>) {
    const { resolve = defaultFieldResolver } = field;

    // eslint-disable-next-line no-param-reassign
    field.resolve = function (...args) {
      const [, , context] = args;

      if (!context.authenticatedUser) {
        throw new AuthenticationError("Invalid session");
      }

      return resolve.apply(this, args);
    };
  }
}
