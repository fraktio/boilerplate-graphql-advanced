import { gql } from "apollo-server-express";
import { Express } from "express";

import { createTestServer } from "~/tests/createTestServer";
import { gqlRequest } from "~/tests/graphqlTestUtils";

const getIsReservedApartmentQuery = gql`
  query GetAuthenticatedUser {
    authenticatedUser {
      __typename
    }
  }
`;

const logoutMutation = gql`
  mutation Logout {
    logout
  }
`;

describe("Graphql / endpoints", () => {
  let server: Express;

  beforeAll(async () => {
    const { app } = await createTestServer();
    server = app;
  });

  it("GetAuthenticatedUser no session", async () => {
    const { body } = await gqlRequest(server, getIsReservedApartmentQuery);

    expect(body.data.authenticatedUser.__typename).toBe(
      "AuthenticatedUserFailure",
    );
  });

  it("GetAuthenticatedUser no session", async () => {
    const { body } = await gqlRequest(server, getIsReservedApartmentQuery);

    expect(body.data.authenticatedUser.__typename).toBe(
      "AuthenticatedUserFailure",
    );
  });

  it("logout", async () => {
    const { body } = await gqlRequest(server, logoutMutation);

    expect(body.data.logout).toBeTruthy();
  });
});
