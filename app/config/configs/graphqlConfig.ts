import {
  GRAPHQL_ALLOW_INTROSPECTION,
  GRAPHQL_INLINE_TRACE,
} from "~/config/envNames";
import { getEnvBool } from "~/config/getters";

export type GraphqlConfig = {
  allowIntrospection: boolean;
  allowInlineTrace: boolean;
};

export const createGraphqlgConfig = (): GraphqlConfig => ({
  allowIntrospection: getEnvBool(GRAPHQL_ALLOW_INTROSPECTION),
  allowInlineTrace: getEnvBool(GRAPHQL_INLINE_TRACE),
});
