import type { Knex } from "knex";

import {
  DateFilter,
  TimeFilter,
  StringFilter,
  FilterOperator,
  PersonFilterOperation,
  CompanyFilterOperation,
  Maybe,
} from "~/generation/generated";

export class InvalidFilterCountError extends Error {}

export type FilterOperation = CompanyFilterOperation | PersonFilterOperation;

export type Filters = Readonly<{
  [fieldName: string]: Maybe<Filter | FilterOperation[]>;
}>;

export type Filter = TimeFilter | DateFilter | StringFilter;

export function buildFilterQuery(
  queryBuilder: Knex.QueryBuilder,
  applyFilters: (input: {
    queryBuilder: Knex.QueryBuilder;
    filterOperator: FilterOperator;
    filter: Filters;
  }) => Knex.QueryBuilder,
  filterOperation?: FilterOperation,
): Knex.QueryBuilder {
  if (!filterOperation) {
    return queryBuilder;
  }

  const operationFilters = filterOperation.filters;
  if (!operationFilters) {
    return queryBuilder;
  }

  operationFilters.forEach((filter) => {
    applyFilters({
      queryBuilder,
      filterOperator: filterOperation.operator,
      filter: filter,
    });
    const subOperations = filter.filterOperations;

    if (subOperations) {
      subOperations.forEach((subOperation) => {
        if (filterOperation.operator === FilterOperator.Or) {
          queryBuilder.orWhere((qb) =>
            buildFilterQuery(qb, applyFilters, subOperation),
          );
        } else {
          queryBuilder.andWhere((qb) =>
            buildFilterQuery(qb, applyFilters, subOperation),
          );
        }
      });
    }
  });

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

function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

type OperatorName = keyof typeof filterOperatorMap;

function getSqlOperator(input: {
  operatorName: OperatorName;
}): ComparisonOperator {
  if (!(input.operatorName in filterOperatorMap)) {
    throw new Error(`Inavalid operator name ${input.operatorName}`);
  }

  return prop(filterOperatorMap, input.operatorName);
}

export function applyTimeFilters(input: {
  queryBuilder: Knex.QueryBuilder;
  filterOperator: FilterOperator;
  field: string;
  timeFilter: TimeFilter;
}): Knex.QueryBuilder {
  const { queryBuilder, filterOperator, field, timeFilter } = input;

  const operatorNames = Object.keys(timeFilter) as (keyof TimeFilter)[];

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

  const operatorNames = Object.keys(dateFilter) as (keyof DateFilter)[];

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
