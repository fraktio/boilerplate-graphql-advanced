import { Knex } from "knex";
import { DateTime } from "luxon";

import { Maybe } from "~/@types/global";
import { getSqlOperator, FilterOperator } from "~/database/filters/operators";

export type DateFilter = {
  equal?: Maybe<DateTime>;
  notEqual?: Maybe<DateTime>;
  lessThan?: Maybe<DateTime>;
  lessOrEqualThan?: Maybe<DateTime>;
  greaterThan?: Maybe<DateTime>;
  greaterOrEqualThan?: Maybe<DateTime>;
};

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
