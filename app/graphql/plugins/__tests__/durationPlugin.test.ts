import {
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
} from "apollo-server-types";

import { Context } from "~/graphql/context";
import { durationPlugin } from "~/graphql/plugins/durationPlugin";

describe("graphql / plugins / durationPlugin", () => {
  const requestContext = {} as unknown as GraphQLRequestContext<Context>;

  const willSendResponseContext = {
    context: {
      startTime: Date.now(),
    },
    response: {
      extensions: {
        mock: "mock",
      },
    },
  } as unknown as GraphQLRequestContextWillSendResponse<Context>;

  it("returning payload", async () => {
    if (!durationPlugin.requestDidStart) {
      throw new Error("No 'requestDidStart' in 'durationPlugin'");
    }

    const requestDidStartResponse = await durationPlugin.requestDidStart(
      requestContext,
    );
    if (!requestDidStartResponse) {
      throw new Error("No listeners in 'durationPlugin.requestDidStart'");
    }

    if (!requestDidStartResponse.willSendResponse) {
      throw new Error("No 'willSendResponse' in 'durationPlugin'");
    }

    requestDidStartResponse.willSendResponse(willSendResponseContext);

    expect(willSendResponseContext).toMatchObject({
      context: { startTime: expect.any(Number) },
      response: {
        extensions: {
          durationMilliseconds: expect.any(Number),
          mock: "mock",
        },
      },
    });
  });
});
