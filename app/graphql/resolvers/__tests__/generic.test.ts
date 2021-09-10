import { gql } from "apollo-server-express";

import { createTestServer } from "~/tests/createTestServer";
import { gqlRequest } from "~/tests/graphqlTestUtils";
import { registerTestHandlers } from "~/tests/registerTestHandlers";

const getAuthenticatedUserQuery = gql`
  query GetAuthenticatedUser {
    authenticatedUser {
      __typename
    }
  }
`;

const { app, startServer } = createTestServer();
registerTestHandlers({ startServer });

describe("Graphql / endpoints", () => {
  it("extensions in response", async () => {
    const { body } = await gqlRequest(app, getAuthenticatedUserQuery);

    expect(body.extensions).toMatchObject({
      requestId: expect.any(String),
      durationMilliseconds: expect.any(Number),
      operationName: "GetAuthenticatedUser",
    });
  });
});
