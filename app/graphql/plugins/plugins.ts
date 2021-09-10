import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import responseCachePlugin from "apollo-server-plugin-response-cache";

import { EnvConfig } from "~/config/configs/envConfig";
import { durationPlugin } from "~/graphql/plugins/durationPlugin";
import { apolloServerLoggerPlugin } from "~/graphql/plugins/loggerPlugin";
import { operationNamePlugin } from "~/graphql/plugins/operationNamePlugin";
import { requestIdPlugin } from "~/graphql/plugins/requestIdPlugin";

export const createPlugins = (params: {
  envConfig: EnvConfig;
}): Array<ApolloServerPlugin> => {
  const playgroundPlugin = params.envConfig.isProduction
    ? ApolloServerPluginLandingPageDisabled()
    : ApolloServerPluginLandingPageGraphQLPlayground({
        settings: { "request.credentials": "include" },
      });

  return [
    playgroundPlugin,
    apolloServerLoggerPlugin,
    responseCachePlugin(),
    operationNamePlugin,
    durationPlugin,
    requestIdPlugin,
  ];
};
