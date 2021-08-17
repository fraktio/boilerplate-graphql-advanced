import { Maybe } from "graphql-tools";
import type { Knex } from "knex";

import { CompanyFilterOperation } from "~/database/company/companyFilters";
import { DateFilter } from "~/database/filters/dateFilters";
import { FilterOperator } from "~/database/filters/operators";
import { StringFilter } from "~/database/filters/stringFilters";
import { TimeFilter } from "~/database/filters/timeFilter";
import { PersonFilterOperation } from "~/database/person/personFilters";

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
