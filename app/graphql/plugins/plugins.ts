import { ApolloServerPlugin } from "apollo-server-plugin-base";
import responseCachePlugin from "apollo-server-plugin-response-cache";

import { GraphqlConfig } from "~/config/configs/graphqlConfig";
import { durationPlugin } from "~/graphql/plugins/durationPlugin";
import { createInlineTracePlugin } from "~/graphql/plugins/inlineTracePlugin";
import { apolloServerLoggerPlugin } from "~/graphql/plugins/loggerPlugin";
import { operationNamePlugin } from "~/graphql/plugins/operationNamePlugin";
import { createPlaygroundPlugin } from "~/graphql/plugins/playgroundPlugin";
import { requestIdPlugin } from "~/graphql/plugins/requestIdPlugin";

export const createPlugins = (params: {
  graphqlConfig: GraphqlConfig;
}): Array<ApolloServerPlugin> => [
  apolloServerLoggerPlugin,
  createPlaygroundPlugin({ graphqlConfig: params.graphqlConfig }),
  responseCachePlugin(),
  operationNamePlugin,
  durationPlugin,
  requestIdPlugin,
  ...createInlineTracePlugin({ graphql: params.graphqlConfig }),
];
