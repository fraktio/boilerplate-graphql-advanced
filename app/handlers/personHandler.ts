import { Maybe } from "graphql-tools";

import { ValueOf } from "~/@types/global";
import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import { companyDB, CompanyTable } from "~/database/company/companyDatabase";
import { DBSession } from "~/database/connection";
import { CompaniesOfPersonDataLoader } from "~/database/employee/CompaniesOfPersonDataLoader";
import {
  getPaginationLimit,
  getPaginationQueryCursorsFromSort,
  Pagination,
  PAGINATION_LIMIT_OVERFLOW,
  QueryCursor,
} from "~/database/pagination";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { personDB } from "~/database/person/personDatabase";
import { PersonFilterOperation } from "~/database/person/personFilters";
import {
  CreatePersonOptions,
  PersonID,
  PersonTable,
  UpdatePersonOptions,
} from "~/database/person/personQueries";
import { createSortParams, SortColumn, SortOrder } from "~/database/sort";
import { UUID } from "~/generation/mappers";
import { PaginationResponse } from "~/handlers/pagination";

export enum PersonSortField {
  Birthday = "birthday",
  FirstName = "firstName",
  LastName = "lastName",
  CreatedAt = "createdAt",
}

export type PersonSortInput = {
  field: PersonSortField;
  order: SortOrder;
};

export const personHandler = async (params: {
  knex: DBSession;
  personUUID: UUID;
  personDL: PersonDataLoader;
}): Promise<Maybe<PersonTable>> =>
  await personDB.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    personDL: params.personDL,
  });

export type PersonsPaginationResponse = PaginationResponse<PersonTable>;

export const personsHandler = async (params: {
  knex: DBSession;
  personDL: PersonDataLoader;
  filters?: PersonFilterOperation;
  sort?: PersonSortInput[];
  pagination: Pagination;
}): Promise<PersonsPaginationResponse> => {
  const sort = createSortParams({
    sort: params.sort,
    defaultSortField: PersonSortField.Birthday,
  });
  const { pagination, knex, personDL, filters } = params;

  const queryCursors = await getPersonPaginationCursors({
    knex: knex,
    personDL: personDL,
    sort: sort,
    queryCursorUUID: pagination.cursor?.queryCursor,
  });

  const limit = getPaginationLimit(pagination.limit || undefined);

  const results = await personDB.getAll({
    knex: knex,
    personDL: personDL,
    filters: filters,
    sort: sort,
    queryCursor: queryCursors,
    limit: limit + PAGINATION_LIMIT_OVERFLOW,
  });

  const hasNextPage = results.length > limit;

  if (hasNextPage) {
    results.pop();
  }

  const edges = results.map((result) => ({
    cursor: { queryCursor: result.UUID },
    node: result,
  }));

  const response = {
    pageInfo: {
      hasNextPage,
    },
    edges,
  };

  return response;
};

export const getPersonPaginationCursors = async (params: {
  knex: DBSession;
  personDL: PersonDataLoader;
  queryCursorUUID?: UUID;
  sort: SortColumn[];
}): Promise<QueryCursor<ValueOf<PersonTable>>[]> => {
  const { knex, personDL, queryCursorUUID, sort } = params;
  if (!queryCursorUUID) {
    return [];
  }

  const cursorItem = await personDB.tryGetByUUID({
    knex: knex,
    personUUID: queryCursorUUID,
    personDL: personDL,
  });

  return getPaginationQueryCursorsFromSort({ cursorItem: cursorItem, sort });
};

export const addPersonHandler = async (params: {
  knex: DBSession;
  person: CreatePersonOptions;
  personDL: PersonDataLoader;
}): Promise<PersonTable> =>
  await personDB.create({
    knex: params.knex,
    person: params.person,
    personDL: params.personDL,
  });

export const modifyPerson = async (params: {
  knex: DBSession;
  personUUID: UUID;
  modifiedPerson: UpdatePersonOptions;
  personDL: PersonDataLoader;
}): Promise<Maybe<PersonTable>> =>
  await personDB.updateByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    person: params.modifiedPerson,
    personDL: params.personDL,
  });

export const adultEmployersHandler = async (params: {
  knex: DBSession;
  personId: PersonID;
  companyDL: CompanyDataLoader;
  companiesOfPersonDL: CompaniesOfPersonDataLoader;
}): Promise<CompanyTable[]> =>
  await companyDB.getCompaniesOfPerson({
    knex: params.knex,
    personId: params.personId,
    companyDL: params.companyDL,
    companiesOfPersonDL: params.companiesOfPersonDL,
  });
