declare module "graphql-validation-complexity" {
  type Costs = {
    scalarCost?: number;
    objectCost?: number;
    listFactor?: number;
    introspectionListFactor?: number;
    createError?: (cost: number, documentNode: unknown) => GraphQLError;
    onCost?: (cost) => void;
    formatErrorMessage?: (cost: number) => string;
  };

  export type ComplexityCheck = (maxValue: number, costs?: Costs) => void;
  export const createComplexityLimitRule: ComplexityCheck;
}
