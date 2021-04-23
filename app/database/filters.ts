import { Maybe } from "graphql/jsutils/Maybe";
import { Knex } from "knex";

import { DateFilter, TimeFilter } from "~/generation/generated";

export class InvalidFilterCountError extends Error {}

export type FieldMap = (name: string) => string;

export type Filters = Readonly<{
  [fieldName: string]: Maybe<Filter>;
}>;

export type Filter = Readonly<{
  timeFilter?: Maybe<TimeFilter>;
  dateFilter?: Maybe<DateFilter>;
}>;

export function addFilters(
  queryBuilder: Knex.QueryBuilder,
  filters: Maybe<Filters>,
  fieldMap: FieldMap,
): Knex.QueryBuilder {
  if (!filters) {
    return queryBuilder;
  }

  for (const [fieldNameIndex, filter] of Object.entries(filters)) {
    if (!filter) {
      continue;
    }
    const fieldName = fieldMap(fieldNameIndex);
    if (filter.dateFilter) {
      createDateFilterSql(queryBuilder, fieldName, filter.dateFilter);
    }
    if (filter.timeFilter) {
      createTimeFilterSql(queryBuilder, fieldName, filter.timeFilter);
    }
  }

  return queryBuilder;
}

export function createTimeFilterSql(
  queryBuilder: Knex.QueryBuilder,
  timeField: string,
  timeFilter: TimeFilter,
): Knex.QueryBuilder {
  if (timeFilter.equal) {
    queryBuilder.andWhere(timeField, "=", timeFilter.equal);
  }
  if (timeFilter.notEqual) {
    queryBuilder.andWhere(timeField, "<>", timeFilter.notEqual);
  }
  if (timeFilter.lessThan) {
    queryBuilder.andWhere(timeField, "<", timeFilter.lessThan);
  }
  if (timeFilter.lessOrEqualThan) {
    queryBuilder.andWhere(timeField, "<=", timeFilter.lessOrEqualThan);
  }
  if (timeFilter.greaterThan) {
    queryBuilder.andWhere(timeField, ">", timeFilter.greaterThan);
  }
  if (timeFilter.greaterOrEqualThan) {
    queryBuilder.andWhere(timeField, ">=", timeFilter.greaterOrEqualThan);
  }

  return queryBuilder;
}

export function createDateFilterSql(
  queryBuilder: Knex.QueryBuilder,
  dateField: string,
  dateFilter: DateFilter,
): Knex.QueryBuilder {
  if (dateFilter.equal) {
    queryBuilder.andWhere(dateField, "=", dateFilter.equal);
  }
  if (dateFilter.notEqual) {
    queryBuilder.andWhere(dateField, "<>", dateFilter.notEqual);
  }
  if (dateFilter.lessThan) {
    queryBuilder.andWhere(dateField, "<", dateFilter.lessThan);
  }
  if (dateFilter.lessOrEqualThan) {
    queryBuilder.andWhere(dateField, "<=", dateFilter.lessOrEqualThan);
  }
  if (dateFilter.greaterThan) {
    queryBuilder.andWhere(dateField, ">", dateFilter.greaterThan);
  }
  if (dateFilter.greaterOrEqualThan) {
    queryBuilder.andWhere(dateField, ">=", dateFilter.greaterOrEqualThan);
  }

  return queryBuilder;
}

// TArkista filteröinti kirjasto!??!

// https://dev.to/mgustus/filtering-graphql-query-using-typescript-and-typeorm-2l49
