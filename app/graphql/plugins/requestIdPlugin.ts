import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";

import { Context } from "~/graphql/context";
import { willSendResponseExtensions } from "~/graphql/plugins/pluginMergers";

export const requestIdPlugin: ApolloServerPlugin<Context> = {
  requestDidStart: async (): Promise<GraphQLRequestListener<Context>> => ({
    willSendResponse: await willSendResponseExtensions((requestContext) => ({
      requestId: requestContext.context.requestId,
    })),
  }),
};
