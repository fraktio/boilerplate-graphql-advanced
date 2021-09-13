import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { AuthenticationError } from "apollo-server-express";
import { GraphQLSchema } from "graphql";

const directiveName = "auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typeDirectiveArgumentMaps: Record<string, any> = {};

export function authDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.TYPE]: (type) => {
      const authDirective = getDirective(schema, type, directiveName)?.[0];
      if (authDirective) {
        typeDirectiveArgumentMaps[type.name] = authDirective;
      }

      return undefined;
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const authDirective =
        getDirective(schema, fieldConfig, directiveName)?.[0] ??
        typeDirectiveArgumentMaps[typeName];
      if (authDirective) {
        const { requires } = authDirective;
        if (requires) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (source, args, context, info) {
            if (!context.authenticatedUser) {
              // context.headers.authToken
              throw new AuthenticationError("Authentication required");
            }
            const { authenticatedUser } = context;

            if (!authenticatedUser.accessLevel.includes(requires)) {
              throw new Error(
                `Autehnticated user doesn't have required access right: <${requires}> for field: <${requires}>`,
              );
            }

            return resolve(source, args, context, info);
          };

          return fieldConfig;
        }
      }
    },
  });
}
