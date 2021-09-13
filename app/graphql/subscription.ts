import { ApolloServer } from "apollo-server-express";
import { execute, GraphQLSchema, subscribe } from "graphql";
import { Server } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";

export const createSubscription = (params: {
  schema: GraphQLSchema;
  httpServer: Server;
}): SubscriptionServer => {
  // Providing `onConnect` is the `SubscriptionServer` equivalent to the
  // `context` function in `ApolloServer`. Please [see the docs](https://github.com/apollographql/subscriptions-transport-ws#constructoroptions-socketoptions--socketserver)
  // for more information on this hook.
  const handleConnection = (): Record<string, string> => ({});

  const server = new ApolloServer({ schema: params.schema, context: {} });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema: params.schema,
      execute,
      subscribe,
      onConnect: handleConnection,
    },
    {
      server: params.httpServer,
      path: server.graphqlPath,
    },
  );

  return subscriptionServer;
};
