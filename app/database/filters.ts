import { Maybe } from "graphql/jsutils/Maybe";
import { Knex } from "knex";
import { DateTime } from "luxon";

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

export function createTimeFilterSql(input: {
  queryBuilder: Knex.QueryBuilder;
  filterOperator: FilterOperator;
  field: string;
  timeFilter: TimeFilter;
}): Knex.QueryBuilder {
  const { queryBuilder, filterOperator, field, timeFilter } = input;
  const operatorNames = Object.keys(timeFilter);

  operatorNames.forEach((operatorName) => {
    const operator = filterOperatorMap[operatorName];

    if (filterOperator === FilterOperator.Or) {
      queryBuilder.orWhere(field, operator, timeFilter[operatorName]);
    } else {
      queryBuilder.andWhere(field, operator, timeFilter[operatorName]);
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
  const operatorNames = Object.keys(dateFilter);

  operatorNames.forEach((operatorName) => {
    const operator = filterOperatorMap[operatorName];

    if (filterOperator === FilterOperator.Or) {
      queryBuilder.orWhere(field, operator, dateFilter[operatorName]);
    } else {
      queryBuilder.andWhere(field, operator, dateFilter[operatorName]);
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
