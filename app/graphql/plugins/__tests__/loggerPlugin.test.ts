import {
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors,
} from "apollo-server-types";

import { Context } from "~/graphql/context";
import { apolloServerLoggerPlugin } from "~/graphql/plugins/loggerPlugin";

describe("graphql / plugins / apolloServerLoggerPlugin", () => {
  it("returning payload", async () => {
    const infoMock = jest.fn();
    const errorMock = jest.fn();
    const requestContext = {
      context: {
        logger: {
          info: infoMock,
          error: errorMock,
        },
        authenticatedUser: {
          UUID: "UUID",
        },
      },
      request: {
        http: {
          url: "/graphql",
        },
        operationName: "operationName",
        query: "query",
      },
    } as unknown as GraphQLRequestContext<Context>;
    const { requestDidStart } = apolloServerLoggerPlugin;

    if (!requestDidStart) {
      throw new Error("No 'requestDidStart' in 'apolloServerLoggerPlugin'");
    }

    const listeners = requestDidStart(requestContext);

    if (!listeners?.didEncounterErrors) {
      throw new Error("No 'didEncounterErrors' in 'apolloServerLoggerPlugin'");
    }

    const requestErrorContext = {
      ...requestContext,
      errors: [{ name: "name", stack: "stack", extra: "extra" }],
    } as unknown as GraphQLRequestContextDidEncounterErrors<Context>;

    listeners.didEncounterErrors(requestErrorContext);

    expect(infoMock.mock.calls).toMatchObject([
      [
        {
          authenticatedUserUUID: "UUID",
          graphqlQuery: "query",
          operationName: "operationName",
          url: "/graphql",
        },
        "Apollo requestDidStart",
      ],
    ]);
    expect(errorMock.mock.calls).toMatchObject([
      [
        {
          authenticatedUserUUID: "UUID",
          errors: [{ extra: "extra", name: "name", stack: "stack" }],
          operationName: "operationName",
        },
        "Apollo didEncounterErrors",
      ],
    ]);
  });
});
