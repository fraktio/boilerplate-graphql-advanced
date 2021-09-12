import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import { ApolloServerPlugin } from "apollo-server-plugin-base";

import { EnvConfig } from "~/config/configs/envConfig";
import { Context } from "~/graphql/context";

export const createPlaygroundPlugin = (params: {
  envConfig: EnvConfig;
}): ApolloServerPlugin<Context> => {
  if (params.envConfig.isProduction) {
    return ApolloServerPluginLandingPageDisabled();
  }

  return ApolloServerPluginLandingPageGraphQLPlayground({
    settings: { "request.credentials": "include", "editor.theme": "dark" },
  });
};
