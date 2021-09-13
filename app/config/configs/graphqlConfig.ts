import { GRAPHQL_SHOW_PLAYGROUND } from "~/config/envNames";
import { getEnvBool } from "~/config/getters";

export type GraphqlConfig = {
  showPlayground: boolean;
};

export const createGraphqlgConfig = (): GraphqlConfig => ({
  showPlayground: getEnvBool(GRAPHQL_SHOW_PLAYGROUND),
});
