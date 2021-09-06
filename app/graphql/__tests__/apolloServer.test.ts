import { createApolloServer } from "~/graphql/apolloServer";
import { createTestConfig } from "~/tests/testConfig";

const config = createTestConfig();

describe("Graphql / endpoints", () => {
  it("logout", async () => {
    const server = createApolloServer({ config });

    expect(server.constructor.name).toBe("ApolloServer");
  });
});
