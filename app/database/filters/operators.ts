export enum FilterOperator {
  And = "AND",
  Or = "OR",
}

enum ComparisonOperator {
  EQUAL = "=",
  NOTEQUAL = "<>",
  LESSTHAN = "<",
  LESSOREQUALTHAN = "<=",
  GREATERTHAN = ">",
  GREATEROREQUALTHAN = ">=",
}

const filterOperatorMap = {
  equal: ComparisonOperator.EQUAL,
  notEqual: ComparisonOperator.NOTEQUAL,
  lessThan: ComparisonOperator.LESSTHAN,
  lessOrEqualThan: ComparisonOperator.LESSOREQUALTHAN,
  greaterThan: ComparisonOperator.GREATERTHAN,
  greaterOrEqualThan: ComparisonOperator.GREATEROREQUALTHAN,
};

function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export type OperatorName = keyof typeof filterOperatorMap;

export function getSqlOperator(input: {
  operatorName: OperatorName;
}): ComparisonOperator {
  if (!(input.operatorName in filterOperatorMap)) {
    throw new Error(`Inavalid operator name ${input.operatorName}`);
  }

  return prop(filterOperatorMap, input.operatorName);
}
