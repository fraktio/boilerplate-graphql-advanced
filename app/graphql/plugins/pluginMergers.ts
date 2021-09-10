import { GraphQLRequestContextWillSendResponse } from "apollo-server-types";

import { Context } from "~/graphql/context";

type WillSendResponseParams = GraphQLRequestContextWillSendResponse<Context>;

type ContentFC = (params: WillSendResponseParams) => Record<string, unknown>;

export const willSendResponseExtensions =
  (contentFC: ContentFC) =>
  async (params: WillSendResponseParams): Promise<void> => {
    const newExtensions = {
      ...params.response.extensions,
      ...contentFC(params),
    };

    // eslint-disable-next-line no-param-reassign
    params.response.extensions = newExtensions;
  };
