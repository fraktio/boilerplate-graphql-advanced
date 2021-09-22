import { ApolloServerPlugin } from "apollo-server-plugin-base";

import { Context } from "~/graphql/context";

export const apolloServerLoggerPlugin: ApolloServerPlugin<Context> = {
  requestDidStart: async (requestContext) => {
    requestContext.context.logger.info(
      {
        authenticatedUserUUID:
          requestContext.context.authenticatedUser?.id ?? null,
        url: requestContext.request.http?.url,
        operationName: requestContext.request.operationName,
        graphqlQuery: requestContext.request.query,
      },
      "Apollo requestDidStart",
    );

    return {
      didEncounterErrors: async (requestContext): Promise<void> => {
        requestContext.context.logger.error(
          {
            authenticatedUserUUID:
              requestContext.context.authenticatedUser?.id ?? null,
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
