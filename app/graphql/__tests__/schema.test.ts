import { createExecutableSchema, createSchema } from "~/graphql/schema";

describe("Graphql / schema", () => {
  it("createSchema", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { resolvers, typeDefs, ...rest } = createSchema();

    expect(rest).toMatchSnapshot();
  });

  it("createExecutableSchema", async () => {
    const schema = createExecutableSchema();

    expect(schema).toMatchSnapshot();
  });
});
