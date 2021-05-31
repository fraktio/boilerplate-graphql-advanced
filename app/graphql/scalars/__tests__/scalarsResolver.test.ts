import { createScalarResolvers } from "~/graphql/scalars/scalarsResolver";

describe("graphql scalars / scalarsResolver", () => {
  it("createScalarResolvers", async () => {
    expect(createScalarResolvers()).toMatchSnapshot();
  });
});
