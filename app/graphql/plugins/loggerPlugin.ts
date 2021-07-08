import { ApolloServerPlugin, ValueOrPromise } from "apollo-server-plugin-base";

import { Context } from "~/graphql/context";

export const apolloServerLoggerPlugin: ApolloServerPlugin<Context> = {
  requestDidStart: (requestContext) => {
    requestContext.context.logger.info(
      {
        authenticatedUserUUID:
          requestContext.context.authenticatedUser?.UUID ?? null,
        url: requestContext.request.http?.url,
        operationName: requestContext.request.operationName,
        graphqlQuery: requestContext.request.query,
      },
      "Apollo requestDidStart",
    );

    return {
      didEncounterErrors: (requestContext): ValueOrPromise<void> => {
        requestContext.context.logger.error(
          {
            authenticatedUserUUID:
              requestContext.context.authenticatedUser?.UUID ?? null,
            operationName: requestContext.request.operationName,
            errors: requestContext.errors.map((error) => ({
              ...error,
              name: error.name,
              stack: error.stack,
            })),
          },
          "Apollo didEncounterErrors",
        );
      },
    };
  },
};
