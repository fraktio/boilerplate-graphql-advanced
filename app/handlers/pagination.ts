import { Cursor } from "~/graphql/scalars/CursorResolver";

export type PaginationEdge<T> = {
  cursor: Cursor;
  node: T;
};

export type PaginationResponse<T> = {
  edges: PaginationEdge<T>[];
  pageInfo: {
    hasNextPage: boolean;
  };
};
