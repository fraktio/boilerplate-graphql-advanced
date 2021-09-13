import {
  ApolloServerPlugin,
  GraphQLServerListener,
} from "apollo-server-plugin-base";
import { SubscriptionServer } from "subscriptions-transport-ws";

import { Context } from "~/graphql/context";

export const createSubscriptionPlugin = (params: {
  subscriptionServer: SubscriptionServer;
}): ApolloServerPlugin<Context> => ({
  async serverWillStart(): Promise<GraphQLServerListener> {
    return {
      async drainServer(): Promise<void> {
        params.subscriptionServer.close();
      },
    };
  },
});
