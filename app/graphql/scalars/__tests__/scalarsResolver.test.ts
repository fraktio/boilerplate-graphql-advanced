import { createScalarResolvers } from "../scalarsResolver";

describe("graphql scalars / scalarsResolver", () => {
  it("createScalarResolvers", async () => {
    expect(createScalarResolvers()).toMatchSnapshot();
  });
});
