import { CountryCode, Language } from "../scalars";

describe("generation / scalarTypes", () => {
  it("Language", async () => {
    expect(Language).toMatchSnapshot();
  });

  it("CountryCode", async () => {
    expect(CountryCode).toMatchSnapshot();
  });
});
