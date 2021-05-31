import { createTestConfig } from "~/config/testConfig";
import { createApolloServer } from "~/graphql/apolloServer";

const config = createTestConfig();

describe("Graphql / endpoints", () => {
  it("logout", async () => {
    const server = createApolloServer({ config });

    expect(server.constructor.name).toBe("ApolloServer");
  });
});
