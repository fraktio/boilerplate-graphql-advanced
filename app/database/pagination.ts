import { Knex } from "knex";

import { Maybe } from "~/@types/global";
import { SortColumn, SortOrder } from "~/database/sort";
import { Cursor } from "~/graphql/scalars/CursorResolver";

export const PAGINATION_DEFAULT_LIMIT = 20;
export const PAGINATION_LIMIT_OVERFLOW = 1;

export function getPaginationLimit(limit?: number): number {
  return limit || PAGINATION_DEFAULT_LIMIT;
}

export type Pagination = {
  limit?: Maybe<number>;
  cursor?: Maybe<Cursor>;
};

export type QueryCursor<T> = {
  column: string;
  order: SortOrder;
  value: T;
};

export const getPaginationQueryCursorsFromSort = <T>(params: {
  cursorItem: Record<string, T>;
  sort: SortColumn[];
}): QueryCursor<T>[] => {
  const queryCursors = params.sort.map((sortItem) => {
    if (sortItem.column in params.cursorItem) {
      return {
        column: sortItem.column,
        value: params.cursorItem[sortItem.column],
        order: sortItem.order,
      };
    }

    throw new Error(`Invalid pagination key ${sortItem.column}`);
  });

  return queryCursors;
};

export function addQueryCursorFilters<T>(
  queryBuilder: Knex.QueryBuilder,
  queryCursors?: QueryCursor<T>[],
): Knex.QueryBuilder {
  if (!queryCursors) {
    return queryBuilder;
  }

  queryCursors.forEach((_, index) => {
    queryBuilder.orWhere((qb) =>
      buildCursorFilter(qb, queryCursors.slice(0, index + 1)),
    );
  });

  return queryBuilder;
}

function buildCursorFilter<T>(
  queryBuilder: Knex.QueryBuilder,
  queryCursors: QueryCursor<T>[],
): Knex.QueryBuilder {
  const filterLength = queryCursors.length;
  queryCursors.forEach((queryCursor, index) => {
    if (queryCursor.column === "uuid") {
      queryBuilder.andWhere(queryCursor.column, ">", queryCursor.value);

      return;
    }
    const comparatorDirection = queryCursor.order === SortOrder.Asc ? ">" : "<";

    const comparator = filterLength === index + 1 ? comparatorDirection : "=";

    queryBuilder.andWhere(queryCursor.column, comparator, queryCursor.value);
  });

  return queryBuilder;
}
