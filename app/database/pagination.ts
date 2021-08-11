import { ValueOf } from "~/@types/global";
import { SortColumn } from "~/database/sort";
import { SortOrder } from "~/generation/generated";

export const PAGINATION_DEFAULT_LIMIT = 20;
export const PAGINATION_LIMIT_OVERFLOW = 1;

export function getPaginationLimit(limit?: number): number {
  return limit || PAGINATION_DEFAULT_LIMIT;
}

export type QueryCursor<T> = {
  column: string;
  order: SortOrder;
  value: T;
};

export const getPaginationQueryCursorsFromSort = <T>(params: {
  cursorItem: T;
  sort: SortColumn[];
}): QueryCursor<ValueOf<T>>[] => {
  const queryCursors = params.sort.map((sortItem) => {
    // TODO, smarter mapping column vs object field names
    const cursorColumn = sortItem.column === "uuid" ? "UUID" : sortItem.column;

    const value = params.cursorItem[cursorColumn as keyof T];

    return { column: sortItem.column, value: value, order: sortItem.order };
  });

  return queryCursors;
};
