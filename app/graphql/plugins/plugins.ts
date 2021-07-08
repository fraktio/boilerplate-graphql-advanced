import { PluginDefinition } from "apollo-server-core";
import responseCachePlugin from "apollo-server-plugin-response-cache";

import { durationPlugin } from "~/graphql/plugins/durationPlugin";
import { apolloServerLoggerPlugin } from "~/graphql/plugins/loggerPlugin";
import { operationNamePlugin } from "~/graphql/plugins/operationNamePlugin";
import { requestIdPlugin } from "~/graphql/plugins/requestIdPlugin";

export const createPlugins = (): PluginDefinition[] => [
  apolloServerLoggerPlugin,
  responseCachePlugin(),
  operationNamePlugin,
  durationPlugin,
  requestIdPlugin,
];
