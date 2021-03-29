import { gql } from "apollo-server-express";

import { createTestServer } from "~/tests/createTestServer";
import { gqlRequest } from "~/tests/graphqlTestUtils";
import { registerTestHandlers } from "~/tests/registerTestHandlers";

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
  input: {
    username: "username",
    password: "password",
    email: "email@testmail.com",
    phoneNumber: "+358400000000",
  },
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

    expect(body.data.register).toBeTruthy();
  });
});
