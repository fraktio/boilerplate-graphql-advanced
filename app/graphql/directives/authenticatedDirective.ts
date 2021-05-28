/* eslint-disable no-param-reassign */
import {
  AuthenticationError,
  SchemaDirectiveVisitor,
} from "apollo-server-express";
import {
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from "graphql";

import { UserAccessLevel } from "~/database/user/userDatabase";
import { Context } from "~/graphql/context";

// Visitor methods for nested types like fields and arguments
// also receive a details object that provides information about
// the parent and grandparent types.

type Args = [
  source: unknown,
  args: {
    [key: string]: unknown;
  },
  context: Context,
  info: GraphQLResolveInfo,
];

interface GraphQLFieldWithAuth<
  TSource,
  TContext,
  TArgs = { [key: string]: unknown },
> extends GraphQLField<TSource, TContext, TArgs> {
  _requiredAuthRole: UserAccessLevel;
}

type GraphQLObjectTypeWithAuth = GraphQLObjectType & {
  _requiredAuthRole: UserAccessLevel;
  _authFieldsWrapped: boolean;
};

export class AuthenticatedDirective extends SchemaDirectiveVisitor {
  visitObject(
    object: GraphQLObjectTypeWithAuth,
  ): GraphQLObjectType | void | null {
    this.ensureFieldsWrapped(object);
    object._requiredAuthRole = this.args.requires;
  }

  visitFieldDefinition(
    field: GraphQLFieldWithAuth<unknown, unknown>,
    details: {
      objectType: GraphQLObjectTypeWithAuth | GraphQLInterfaceType;
    },
  ) {
    if (details.objectType instanceof GraphQLObjectType) {
      this.ensureFieldsWrapped(details.objectType);
      field._requiredAuthRole = this.args.requires;
    }
  }

  ensureFieldsWrapped(objectType: GraphQLObjectTypeWithAuth) {
    if (objectType._authFieldsWrapped) {
      return;
    }
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName] as unknown as GraphQLFieldWithAuth<
        unknown,
        Context,
        { [key: string]: unknown }
      >;
      const { resolve } = field;
      if (!resolve) {
        return;
      }
      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole =
          field._requiredAuthRole || objectType._requiredAuthRole;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }

        const [, , context]: Args = args;

        if (!context.authenticatedUser) {
          throw new AuthenticationError("Authentication required");
        }
        const { authenticatedUser } = context;

        if (!authenticatedUser.accessLevel.includes(requiredRole)) {
          throw new Error(
            `Autehnticated user doesn't have required access right: <${requiredRole}> for field: <${fieldName}>`,
          );
        }

        return resolve.apply(this, args);
      };
    });
  }
}
