import { Maybe } from "graphql/jsutils/Maybe";
import { Knex } from "knex";
import { DateTime } from "luxon";

import { getSqlOperator, FilterOperator } from "~/database/filters/operators";

export type TimeFilter = {
  equal?: Maybe<DateTime>;
  notEqual?: Maybe<DateTime>;
  lessThan?: Maybe<DateTime>;
  lessOrEqualThan?: Maybe<DateTime>;
  greaterThan?: Maybe<DateTime>;
  greaterOrEqualThan?: Maybe<DateTime>;
};

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
