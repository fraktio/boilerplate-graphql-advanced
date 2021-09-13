import { Maybe } from "~/@types/global";
import { FilterOperator } from "~/database/filters/operators";
import { StringFilter } from "~/database/filters/stringFilters";

export type CompanyFilter = {
  filterOperations?: Maybe<Array<CompanyFilterOperation>>;
  nameFilter?: Maybe<StringFilter>;
};

export type CompanyFilterOperation = {
  operator: FilterOperator;
  filters?: Maybe<Array<CompanyFilter>>;
};
