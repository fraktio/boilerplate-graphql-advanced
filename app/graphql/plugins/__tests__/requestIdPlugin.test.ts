import {
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
} from "apollo-server-types";

import { Context } from "~/graphql/context";
import { requestIdPlugin } from "~/graphql/plugins/requestIdPlugin";

describe("graphql / plugins / requestIdPlugin", () => {
  const requestContext = {} as unknown as GraphQLRequestContext<Context>;

  const willSendResponseContext = {
    context: {
      requestId: "requestId",
    },
    response: {
      extensions: {
        mock: "mock",
      },
    },
  } as unknown as GraphQLRequestContextWillSendResponse<Context>;

  it("returning payload", async () => {
    if (!requestIdPlugin.requestDidStart) {
      throw new Error("No 'requestDidStart' in 'requestIdPlugin'");
    }

    const requestDidStartResponse = await requestIdPlugin.requestDidStart(
      requestContext,
    );
    if (!requestDidStartResponse) {
      throw new Error("No listeners in 'requestIdPlugin.requestDidStart'");
    }

    if (!requestDidStartResponse.willSendResponse) {
      throw new Error("No 'willSendResponse' in 'requestIdPlugin'");
    }

    requestDidStartResponse.willSendResponse(willSendResponseContext);

    expect(willSendResponseContext).toMatchObject({
      context: {
        requestId: "requestId",
      },
      response: {
        extensions: {
          requestId: "requestId",
          mock: "mock",
        },
      },
    });
  });
});
