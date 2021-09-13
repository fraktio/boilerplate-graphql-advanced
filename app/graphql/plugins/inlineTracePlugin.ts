import { ApolloServerPluginInlineTrace } from "apollo-server-core";
import { ApolloServerPlugin } from "apollo-server-plugin-base";

import { GraphqlConfig } from "~/config/configs/graphqlConfig";
import { Context } from "~/graphql/context";

export const createInlineTracePlugin = (params: {
  graphql: GraphqlConfig;
}): ApolloServerPlugin<Context>[] => {
  if (!params.graphql.allowInlineTrace) {
    return [ApolloServerPluginInlineTrace()];
  }

  return [];
};
