import { Knex } from "knex";

import { Maybe } from "~/@types/global";
import { FilterOperator } from "~/database/filters/operators";

export type StringFilter = {
  like?: Maybe<string>;
  in?: Maybe<Array<string>>;
};

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
