import { ApolloServerPlugin, ValueOrPromise } from "apollo-server-plugin-base";
import bunyan from "bunyan";

import { Config } from "~/config/config";
import { Context } from "~/graphql/context";

export const apolloServerLogger: ApolloServerPlugin<Context> = {
  requestDidStart: (requestContext) => {
    requestContext.context.logger.info(
      {
        url: requestContext.request.http?.url,
        graphqlQuery: requestContext.request.query,
      },
      "Apollo requestDidStart",
    );

    return {
      didEncounterErrors: (requestContext): ValueOrPromise<void> => {
        requestContext.context.logger.error(
          {
            errors: requestContext.errors.map((error) => ({
              ...error,
              name: error.name,
              stack: error.stack, // force logging stack
            })),
          },
          "Apollo didEncounterErrors",
        );
      },
    };
  },
};

export const createLogger = (opts: { config: Config }): bunyan =>
  bunyan.createLogger({
    name: "graphql-boilerplate-api",
    streams: [
      ...(opts.config.env.stdoutLogging
        ? [{ level: "info" as const, stream: process.stdout }]
        : []),
    ],
  });
