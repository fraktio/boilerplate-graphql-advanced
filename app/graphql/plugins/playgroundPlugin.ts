import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import { ApolloServerPlugin } from "apollo-server-plugin-base";

import { GraphqlConfig } from "~/config/configs/graphqlConfig";
import { Context } from "~/graphql/context";

export const createPlaygroundPlugin = (params: {
  graphqlConfig: GraphqlConfig;
}): ApolloServerPlugin<Context> => {
  if (params.graphqlConfig.showPlayground) {
    return ApolloServerPluginLandingPageGraphQLPlayground({
      settings: { "request.credentials": "include", "editor.theme": "dark" },
    });
  }

  return ApolloServerPluginLandingPageDisabled();
};
