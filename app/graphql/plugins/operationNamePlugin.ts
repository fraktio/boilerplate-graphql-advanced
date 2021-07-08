import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";

import { Context } from "~/graphql/context";
import { willSendResponseExtensions } from "~/graphql/plugins/pluginMergers";

export const operationNamePlugin = (): ApolloServerPlugin<Context> => ({
  requestDidStart: (): GraphQLRequestListener<Context> => ({
    willSendResponse: willSendResponseExtensions((requestContext) => ({
      operationName: requestContext.operationName,
    })),
  }),
});
