import {
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
} from "apollo-server-types";

import { Context } from "~/graphql/context";
import { operationNamePlugin } from "~/graphql/plugins/operationNamePlugin";

describe("graphql / plugins / operationNamePlugin", () => {
  const requestContext = {} as unknown as GraphQLRequestContext<Context>;

  const willSendResponseContext = {
    operationName: "operationName",
    response: {
      extensions: {
        mock: "mock",
      },
    },
  } as unknown as GraphQLRequestContextWillSendResponse<Context>;

  it("returning payload", async () => {
    const { requestDidStart } = operationNamePlugin();
    if (!requestDidStart) {
      throw new Error("No 'requestDidStart' in operationNamePlugin");
    }

    const requestDidStartResponse = requestDidStart(requestContext);
    if (!requestDidStartResponse) {
      throw new Error("No listener in 'operationNamePlugin.requestDidStart'");
    }

    if (!requestDidStartResponse.willSendResponse) {
      throw new Error("No 'willSendResponse' in operationNamePlugin");
    }

    requestDidStartResponse.willSendResponse(willSendResponseContext);

    expect(willSendResponseContext).toMatchObject({
      operationName: "operationName",
      response: {
        extensions: {
          operationName: "operationName",
          mock: "mock",
        },
      },
    });
  });
});
