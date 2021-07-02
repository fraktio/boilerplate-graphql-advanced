import { Knex } from "knex";
import { PhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { DateTime } from "luxon";

import { DBSession } from "~/database/connection";
import {
  buildFilterQuery,
  applyDateFilters,
  applyStringFilters,
} from "~/database/filters";
import { createUUID, ID, Table, tableColumn } from "~/database/tables";
import {
  Maybe,
  PersonFilterOperation,
  PersonFilter,
  FilterOperator,
  PersonSort,
  SortOrder,
} from "~/generation/generated";
import { UUID } from "~/generation/mappers";
import {
  CountryCode,
  EmailAddress,
  FinnishPersonalIdentityCode,
} from "~/generation/scalars";
import { asCountryCode } from "~/validation/converters";

export interface PersonID extends ID {
  __PersonID: never;
}

export type PersonTableRow = Readonly<{
  id: PersonID;
  uuid: UUID;
  firstName: string;
  lastName: string;
  phone: string;
  email: EmailAddress;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date | null;
  nationality: CountryCode;
  personalIdentityCode: FinnishPersonalIdentityCode;
}>;

export type PersonTable = {
  id: PersonID;
  UUID: UUID;
  firstName: string;
  lastName: string;
  phone: PhoneNumber;
  email: EmailAddress;
  birthday: DateTime;
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
  nationality: CountryCode;
  personalIdentityCode: FinnishPersonalIdentityCode;
};

export const formatPersonRow = (row: PersonTableRow): PersonTable => ({
  id: row.id,
  UUID: row.uuid,
  firstName: row.firstName,
  lastName: row.lastName,
  phone: parsePhoneNumber(row.phone),
  email: row.email,
  birthday: DateTime.fromJSDate(row.birthday),
  nationality: asCountryCode(row.nationality),
  personalIdentityCode: row.personalIdentityCode,
  timestamp: {
    createdAt: DateTime.fromJSDate(row.createdAt),
    updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
  },
});

export type CreatePersonOptions = {
  firstName: string;
  lastName: string;
  phone: PhoneNumber | null;
  email: EmailAddress;
  birthday: DateTime;
  nationality: CountryCode;
  personalIdentityCode: FinnishPersonalIdentityCode;
};

export type UpdatePersonOptions = CreatePersonOptions;

export const personQueries = {
  async get(params: {
    knex: DBSession;
    id: PersonID;
  }): Promise<Maybe<PersonTable>> {
    const person = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .where({ id: params.id })
      .first();

    return person ? formatPersonRow(person) : null;
  },

  async getByUUID(params: {
    knex: DBSession;
    personUUID: UUID;
  }): Promise<Maybe<PersonTable>> {
    const person = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .where({ uuid: params.personUUID })
      .first();

    return person ? formatPersonRow(person) : null;
  },

  async getAll(params: {
    knex: DBSession;
    filters?: PersonFilterOperation;
    sort?: PersonSort[];
  }): Promise<PersonTable[]> {
    const persons = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .andWhere((qb) => addPersonFilters(qb, params.filters))
      .orderBy(applyPersonSort(params.sort));

    return persons.map(formatPersonRow);
  },

  async create(params: {
    knex: DBSession;
    person: CreatePersonOptions;
  }): Promise<PersonTable> {
    const phone = params.person.phone?.formatInternational();
    const birthday = params.person.birthday.toJSDate();

    const persons = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .insert({
        uuid: createUUID(),
        firstName: params.person.firstName,
        lastName: params.person.lastName,
        phone,
        email: params.person.email,
        birthday,
      })
      .returning("*");

    return formatPersonRow(persons[0]);
  },

  async updateByUUID(params: {
    knex: DBSession;
    personUUID: UUID;
    person: UpdatePersonOptions;
  }): Promise<Maybe<PersonTable>> {
    const phone = params.person.phone?.formatInternational();
    const birthday = params.person.birthday.toJSDate();

    const persons = await params
      .knex(Table.PERSONS)
      .update({
        firstName: params.person.firstName,
        lastName: params.person.lastName,
        phone,
        email: params.person.email,
        birthday,
      })
      .where({ uuid: params.personUUID })
      .returning("*");

    if (persons.length === 0) {
      return null;
    }

    return formatPersonRow(persons[0]);
  },

  async getPersonsByIds(params: {
    knex: DBSession;
    personIds: readonly PersonID[];
  }): Promise<PersonTable[]> {
    const personRows = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .whereIn("id", params.personIds);

    return personRows.map(formatPersonRow);
  },
};

type ApplyPersonSortResponse = {
  column: string;
  order: SortOrder;
};

function applyPersonSort(sort?: PersonSort[]): ApplyPersonSortResponse[] {
  if (!sort) {
    return [{ column: "firstName", order: SortOrder.Asc }];
  }

  return sort.map((element) => ({
    column: element.field,
    order: element.order,
  }));
}

export function addPersonFilters(
  queryBuilder: Knex.QueryBuilder,
  filterOperation?: PersonFilterOperation,
): Knex.QueryBuilder {
  return buildFilterQuery(queryBuilder, applyPersonFilters, filterOperation);
}

function applyPersonFilters(input: {
  queryBuilder: Knex.QueryBuilder;
  filterOperator: FilterOperator;
  filter: PersonFilter;
}): Knex.QueryBuilder {
  const { queryBuilder, filterOperator, filter } = input;
  if (filter.birthdayFilter) {
    applyDateFilters({
      queryBuilder,
      filterOperator,
      field: tableColumn(Table.PERSONS, "birthday"),
      dateFilter: filter.birthdayFilter,
    });
  }
  if (filter.nameFilter) {
    return applyStringFilters({
      queryBuilder,
      filterOperator,
      field: tableColumn(Table.PERSONS, "firstName"),
      stringFilter: filter.nameFilter,
    });
  }

  return queryBuilder;
}
