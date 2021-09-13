import { GRAPHQL_ALLOW_INTROSPECTION } from "~/config/envNames";
import { getEnvBool } from "~/config/getters";

export type GraphqlConfig = {
  allowIntrospection: boolean;
};

export const createGraphqlgConfig = (): GraphqlConfig => ({
  allowIntrospection: getEnvBool(GRAPHQL_ALLOW_INTROSPECTION),
});
