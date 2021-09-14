import { createServer } from "http";

import { createApolloServer } from "~/graphql/apolloServer";
import { createTestConfig } from "~/tests/testConfig";

const config = createTestConfig();

const httpServer = createServer();

describe("Graphql / endpoints", () => {
  it("logout", async () => {
    const server = createApolloServer({ config, context: {}, httpServer });

    expect(server.constructor.name).toBe("ApolloServer");
  });
});
