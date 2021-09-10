import { gql } from "apollo-server-express";
import nock from "nock";

import { createTestServer } from "~/tests/createTestServer";
import { gqlRequest } from "~/tests/graphqlTestUtils";
import { registerTestHandlers } from "~/tests/registerTestHandlers";

const numberFactQuery = gql`
  query NumberFact($input: NumberFactInput!) {
    numberFact(input: $input) {
      ...NumberFactSuccess
      ...NumberFactFailure
    }
  }

  fragment NumberFactSuccess on NumberFactSuccess {
    numberFact {
      fact
      number
    }
  }

  fragment NumberFactFailure on NumberFactFailure {
    success
  }
`;

const NUMBER = 5;
const numberFactInput = {
  input: { number: NUMBER },
};

const { app, startServer } = createTestServer();
registerTestHandlers({ startServer });

describe("Graphql / endpoints", () => {
  it("numberFact / failure", async () => {
    const scope = nock("http://numbersapi.com/")
      .get(`/${NUMBER}/math`)
      .reply(500, "error");

    const { body } = await gqlRequest(app, numberFactQuery, numberFactInput);

    expect(body.data.numberFact.success).toBe(false);
    scope.done();
  });

  it("numberFact / success", async () => {
    const fact = "200 status code";
    const scope = nock("http://numbersapi.com/")
      .get(`/${NUMBER}/math`)
      .reply(200, fact);

    const { body } = await gqlRequest(app, numberFactQuery, numberFactInput);

    expect(body.data.numberFact.numberFact.fact).toBe(fact);
    expect(body.data.numberFact.numberFact.number).toBe(NUMBER);
    scope.done();
  });
});
