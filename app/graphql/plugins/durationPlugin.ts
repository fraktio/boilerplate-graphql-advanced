import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";

import { Context } from "~/graphql/context";
import { willSendResponseExtensions } from "~/graphql/plugins/pluginMergers";

export const durationPlugin: ApolloServerPlugin<Context> = {
  requestDidStart: async (): Promise<GraphQLRequestListener<Context>> => ({
    willSendResponse: await willSendResponseExtensions((requestContext) => {
      const durationMilliseconds =
        Date.now() - requestContext.context.startTime;

      return { durationMilliseconds };
    }),
  }),
};
