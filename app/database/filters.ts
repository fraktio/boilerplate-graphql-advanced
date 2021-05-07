import { Maybe } from "graphql/jsutils/Maybe";
import { Knex } from "knex";

import {
  DateFilter,
  TimeFilter,
  StringFilter,
  FilterOperator,
} from "~/generation/generated";

export class InvalidFilterCountError extends Error {}

export type FieldMap = (name: string) => string;

export type Filters = Readonly<{
  [fieldName: string]: Maybe<Filter>;
}>;

export type Filter = Readonly<{
  timeFilter?: Maybe<TimeFilter>;
  dateFilter?: Maybe<DateFilter>;
}>;

const filterOperatorMap = {
  equal: "=",
  notEqual: "<>",
  lessThan: "<",
  lessOrEqualThan: "<=",
  greaterThan: ">",
  greaterOrEqualThan: ">=",
};

function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

function getSqlOperator(input: { operatorName: any }) {
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
