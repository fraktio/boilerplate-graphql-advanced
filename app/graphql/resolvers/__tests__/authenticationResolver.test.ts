import { gql } from "apollo-server-express";

import { createTestServer } from "~/tests/createTestServer";
import { gqlRequest } from "~/tests/graphqlTestUtils";
import { registerTestHandlers } from "~/tests/registerTestHandlers";
import { createDatabaseUser } from "~/tests/testDatabase";

const getIsReservedApartmentQuery = gql`
  query GetAuthenticatedUser {
    authenticatedUser {
      __typename
    }
  }
`;

const loginMutation = gql`
  mutation Login($input: LoginUserInput!) {
    login(input: $input) {
      __typename
      ...LoginUserSuccess
      ...LoginUserFailure
    }
  }

  fragment LoginUserSuccess on LoginUserSuccess {
    user {
      UUID
      username
    }
  }

  fragment LoginUserFailure on LoginUserFailure {
    success
  }
`;

const logoutMutation = gql`
  mutation Logout {
    logout
  }
`;

const { app, knex, startServer } = createTestServer();
registerTestHandlers({ startServer });

describe("Graphql / endpoints", () => {
  it("Login / success", async () => {
    const PASSWORD = "password1234";
    const user = await createDatabaseUser({
      knex,
      overrides: { password: PASSWORD },
    });
    const params = {
      input: {
        username: user.username,
        password: PASSWORD,
      },
    };
    const { body, header } = await gqlRequest(app, loginMutation, params);

    expect(body.data.login.__typename).toBe("LoginUserSuccess");
    expect(header["set-cookie"].length).toEqual(1);
  });

  it("Login / failure", async () => {
    const PASSWORD = "samePassword";
    const user = await createDatabaseUser({
      knex,
      overrides: { password: "notTheSamePassword" },
    });
    const params = {
      input: {
        username: user.username,
        password: PASSWORD,
      },
    };
    const { body } = await gqlRequest(app, loginMutation, params);

    expect(body.data.login.__typename).toBe("LoginUserFailure");
  });

  it("GetAuthenticatedUser no session", async () => {
    const { body } = await gqlRequest(app, getIsReservedApartmentQuery);

    expect(body.data.authenticatedUser.__typename).toBe(
      "AuthenticatedUserFailure",
    );
  });

  it("logout", async () => {
    const { body, header } = await gqlRequest(app, logoutMutation);

    expect(body.data.logout).toBeTruthy();
    expect(header["set-cookie"][0]).toBe(
      "authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    );
    expect(header["set-cookie"][1]).toBe(undefined);
  });
});
