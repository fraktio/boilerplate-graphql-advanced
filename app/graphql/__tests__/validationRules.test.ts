import {
  COMPLEXITY_COST,
  COMPLEXITY_LIMIT,
  createValidationRules,
  DEPTH_VALUE_LIMIT,
} from "~/graphql/validationRules";

describe("Graphql / schema", () => {
  it("createValidationRules", async () => {
    const rules = createValidationRules();

    expect(rules.length).toBe(2);
  });

  it("DEPTH_VALUE_LIMIT", async () => {
    expect(DEPTH_VALUE_LIMIT).toMatchSnapshot();
  });

  it("COMPLEXITY_LIMIT", async () => {
    expect(COMPLEXITY_LIMIT).toMatchSnapshot();
  });

  it("COMPLEXITY_COST", async () => {
    expect(COMPLEXITY_COST).toMatchSnapshot();
  });
});
