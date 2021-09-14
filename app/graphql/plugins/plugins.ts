import { ApolloServerPlugin } from "apollo-server-plugin-base";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import { GraphQLSchema } from "graphql";
import { Server } from "http";

import { GraphqlConfig } from "~/config/configs/graphqlConfig";
import { durationPlugin } from "~/graphql/plugins/durationPlugin";
import { createInlineTracePlugin } from "~/graphql/plugins/inlineTracePlugin";
import { apolloServerLoggerPlugin } from "~/graphql/plugins/loggerPlugin";
import { operationNamePlugin } from "~/graphql/plugins/operationNamePlugin";
import { createPlaygroundPlugin } from "~/graphql/plugins/playgroundPlugin";
import { requestIdPlugin } from "~/graphql/plugins/requestIdPlugin";
import { createSubscriptionPlugin } from "~/graphql/plugins/subscriptionPlugin";
import { createSubscription } from "~/graphql/subscription";

export const createPlugins = (params: {
  graphqlConfig: GraphqlConfig;
  schema: GraphQLSchema;
  httpServer: Server;
}): Array<ApolloServerPlugin> => [
  apolloServerLoggerPlugin,
  createPlaygroundPlugin({ graphqlConfig: params.graphqlConfig }),
  ...createInlineTracePlugin({ graphql: params.graphqlConfig }),
  responseCachePlugin(),
  operationNamePlugin,
  durationPlugin,
  requestIdPlugin,
  createSubscriptionPlugin({
    subscriptionServer: createSubscription({
      schema: params.schema,
      httpServer: params.httpServer,
    }),
  }),
];
