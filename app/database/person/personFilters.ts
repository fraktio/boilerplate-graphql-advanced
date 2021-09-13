import { Maybe } from "~/@types/global";
import { DateFilter } from "~/database/filters/dateFilters";
import { FilterOperator } from "~/database/filters/operators";
import { StringFilter } from "~/database/filters/stringFilters";

export type PersonFilterOperation = {
  operator: FilterOperator;
  filters?: Maybe<Array<PersonFilter>>;
};

export type PersonFilter = {
  filterOperations?: Maybe<Array<PersonFilterOperation>>;
  birthdayFilter?: Maybe<DateFilter>;
  nameFilter?: Maybe<StringFilter>;
};
