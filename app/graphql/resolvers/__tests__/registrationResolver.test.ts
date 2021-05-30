import { gql } from "apollo-server-express";

import { userQueries } from "~/database/user/userQueries";
import { createTestServer } from "~/tests/createTestServer";
import { gqlRequest } from "~/tests/graphqlTestUtils";
import { registerTestHandlers } from "~/tests/registerTestHandlers";
import { createUserRegistration } from "~/tests/testData";

const registerMutation = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...RegisterSuccess
      ...RegisterFailure
      ...RegisterFailureAlreadyExists
    }
  }

  fragment RegisterSuccess on RegisterSuccess {
    success
  }

  fragment RegisterFailure on RegisterFailure {
    success
  }

  fragment RegisterFailureAlreadyExists on RegisterFailureAlreadyExists {
    success
  }
`;

const successUser = {
  input: createUserRegistration(),
};

const failureUser = {
  input: {},
};

const { app, knex } = createTestServer();
registerTestHandlers({ knex });

describe("Graphql / endpoints", () => {
  it("register / failure", async () => {
    const { body } = await gqlRequest(app, registerMutation, failureUser);

    expect(Array.isArray(body.errors)).toBeTruthy();
  });

  it("register / success", async () => {
    const { body } = await gqlRequest(app, registerMutation, successUser);

    const user = await userQueries.getByUsername({
      knex,
      username: successUser.input.username,
    });

    expect.objectContaining(user);
    expect(body.data.register).toBeTruthy();
  });
});
