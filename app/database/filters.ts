import { Maybe } from "graphql/jsutils/Maybe";
import { Knex } from "knex";

import {
  DateFilter,
  TimeFilter,
  StringFilter,
  FilterOperator,
  PersonFilterOperation,
  CompanyFilterOperation,
} from "~/generation/generated";

export class InvalidFilterCountError extends Error {}

export type FieldMap = (name: string) => string;

export type FilterOperation = CompanyFilterOperation | PersonFilterOperation;

export type Filters = Readonly<{
  [fieldName: string]: Maybe<Filter>;
}>;

export type Filter = TimeFilter | DateFilter | StringFilter;

export function buildFilterQuery(
  queryBuilder: Knex.QueryBuilder,
  getFilters: (input: {
    queryBuilder: Knex.QueryBuilder;
    filterOperator: FilterOperator;
    filters: Filters;
  }) => Knex.QueryBuilder,
  filterOperation?: FilterOperation,
) {
  if (!filterOperation) {
    return queryBuilder;
  }

  if (!filterOperation.filters) {
    return queryBuilder;
  }

  filterOperation.filters.forEach((filters) => {
    getFilters({
      queryBuilder,
      filterOperator: filterOperation.operator,
      filters,
    });
  });

  const ops = filterOperation.filterOperation;
  if (ops) {
    if (filterOperation.operator === FilterOperator.Or) {
      queryBuilder.orWhere((qb) => buildFilterQuery(qb, getFilters, ops));
    } else {
      queryBuilder.andWhere((qb) => buildFilterQuery(qb, getFilters, ops));
    }
  }

  return queryBuilder;
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

function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

type OperatorName = keyof typeof filterOperatorMap;

// type ValueOf<T> = T[keyof T];
// ValueOf<typeof filterOperatorMap>
function getSqlOperator(input: {
  operatorName: OperatorName;
}): ComparisonOperator {
  if (!(input.operatorName in filterOperatorMap)) {
    throw new Error(`Inavalid operator name ${input.operatorName}`);
  }

  return prop(filterOperatorMap, input.operatorName);
}

declare const OperatorObject: {
  keys<T extends Record<string, unknown>>(object: T): (keyof T)[];
};

export function applyTimeFilters(input: {
  queryBuilder: Knex.QueryBuilder;
  filterOperator: FilterOperator;
  field: string;
  timeFilter: TimeFilter;
}): Knex.QueryBuilder {
  const { queryBuilder, filterOperator, field, timeFilter } = input;
  const operatorNames = OperatorObject.keys(timeFilter);

  operatorNames.forEach((operatorName) => {
    const operator = getSqlOperator({ operatorName });
    const filter = timeFilter[operatorName];
    if (!filter) {
      return queryBuilder;
    }
    if (filterOperator === FilterOperator.Or) {
      queryBuilder.orWhere(field, operator, filter);
    } else {
      queryBuilder.andWhere(field, operator, filter);
    }
  });

  return queryBuilder;
}

export function applyDateFilters(input: {
  queryBuilder: Knex.QueryBuilder;
  filterOperator: FilterOperator;
  field: string;
  dateFilter: DateFilter;
}): Knex.QueryBuilder {
  const { queryBuilder, filterOperator, field, dateFilter } = input;
  const operatorNames = OperatorObject.keys(dateFilter);

  operatorNames.forEach((operatorName) => {
    const operator = getSqlOperator({ operatorName });
    const filter = dateFilter[operatorName];
    if (!filter) {
      return queryBuilder;
    }
    if (filterOperator === FilterOperator.Or) {
      queryBuilder.orWhere(field, operator, filter);
    } else {
      queryBuilder.andWhere(field, operator, filter);
    }
  });

  return queryBuilder;
}

export function applyStringFilters(input: {
  queryBuilder: Knex.QueryBuilder;
  filterOperator: FilterOperator;
  field: string;
  stringFilter: StringFilter;
}): Knex.QueryBuilder {
  const { queryBuilder, filterOperator, field, stringFilter } = input;

  if (stringFilter.like) {
    if (filterOperator === FilterOperator.Or) {
      queryBuilder.orWhere(field, "LIKE", stringFilter.like);
    } else {
      queryBuilder.andWhere(field, "LIKE", stringFilter.like);
    }
  }

  if (stringFilter.in) {
    queryBuilder.whereIn(field, stringFilter.in);
  }

  return queryBuilder;
}
