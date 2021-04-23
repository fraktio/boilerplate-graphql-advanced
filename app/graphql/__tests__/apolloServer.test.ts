import { createApolloServer } from "../apolloServer";

import { createTestConfig } from "~/config/tests";

const config = createTestConfig();

describe("Graphql / endpoints", () => {
  it("logout", async () => {
    const server = createApolloServer({ config });

    expect(server.constructor.name).toBe("ApolloServer");
  });
});
