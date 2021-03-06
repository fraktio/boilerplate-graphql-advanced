import depthLimit from "graphql-depth-limit";
import { createComplexityLimitRule } from "graphql-validation-complexity";

export const createValidationRules = () => {
  const depthLimitRule = depthLimit(6);
  const complexityRule = createComplexityLimitRule(100000000000, {
    scalarCost: 2,
    objectCost: 10,
    listFactor: 20,
  });

  return [depthLimitRule, complexityRule];
};
