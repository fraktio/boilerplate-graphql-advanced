import { createDataLoaders } from "~/database/dataLoaders";

describe("database tests / loaders", () => {
  it("createDataLoaders", async () => {
    const loaders = createDataLoaders();

    expect(loaders).toMatchSnapshot();
  });
});
