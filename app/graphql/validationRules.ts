import depthLimit from "graphql-depth-limit";
import { createComplexityLimitRule } from "graphql-validation-complexity";

export const DEPTH_VALUE_LIMIT = 6;
export const COMPLEXITY_LIMIT = 100000000000;
export const COMPLEXITY_COST = {
  scalarCost: 2,
  objectCost: 10,
  listFactor: 20,
};

export const createValidationRules = () => {
  const depthLimitRule = depthLimit(DEPTH_VALUE_LIMIT);
  const complexityRule = createComplexityLimitRule(
    COMPLEXITY_LIMIT,
    COMPLEXITY_COST,
  );

  return [depthLimitRule, complexityRule];
};
