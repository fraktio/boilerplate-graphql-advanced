import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";

import { Context } from "~/graphql/context";
import { willSendResponseExtensions } from "~/graphql/plugins/pluginMergers";

export const durationPlugin = (): ApolloServerPlugin<Context> => ({
  requestDidStart: (): GraphQLRequestListener<Context> => ({
    willSendResponse: willSendResponseExtensions((requestContext) => {
      const durationMilliseconds =
        Date.now() - requestContext.context.startTime;

      return { durationMilliseconds };
    }),
  }),
});
