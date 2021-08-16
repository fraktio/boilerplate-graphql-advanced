import { SortOrder } from "~/generation/generated";

export type SortColumn = {
  column: string;
  order: SortOrder;
};

export type SortFields = {
  field: string;
  order: SortOrder;
};

export function createSortParams<T extends SortFields>(params: {
  sort?: T[];
  defaultSortField: string;
}): SortColumn[] {
  const { sort, defaultSortField } = params;

  const uuidSort: SortColumn = {
    column: "uuid",
    order: SortOrder.Desc,
  };

  if (!sort) {
    return [{ column: defaultSortField, order: SortOrder.Asc }, uuidSort];
  }

  const sorted = sort.map((element) => ({
    column: element.field,
    order: element.order,
  }));

  return [...sorted, uuidSort];
}
