import { Maybe } from "graphql-tools";
import { Knex } from "knex";
import { PhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { DateTime } from "luxon";

import { ValueOf } from "~/@types/global";
import { DBSession } from "~/database/connection";
import { buildFilterQuery } from "~/database/filters";
import { applyDateFilters } from "~/database/filters/dateFilters";
import { FilterOperator } from "~/database/filters/operators";
import { applyStringFilters } from "~/database/filters/stringFilters";
import { addQueryCursorFilters, QueryCursor } from "~/database/pagination";
import {
  PersonFilter,
  PersonFilterOperation,
} from "~/database/person/personFilters";
import { SortColumn, SortOrder } from "~/database/sort";
import { createUUID, ID, Table, tableColumn } from "~/database/tables";
import { withUniqueConstraintHandler } from "~/database/uniqueConstraintHandler";
import { UUID } from "~/generation/mappers";
import {
  CountryCode,
  EmailAddress,
  FinnishPersonalIdentityCode,
} from "~/generation/scalars";
import { NotFoundFailure } from "~/handlers/failures/NotFoundFailure";
import { UniqueConstraintViolationFailure } from "~/handlers/failures/UniqueConstraintViolationFailure";
import { toFailure, toSuccess, Try } from "~/utils/validation";
import { asCountryCode } from "~/validation/converters";

const PERSON_DEFAULT_SORT = { column: "createdAt", order: SortOrder.Desc };

export interface PersonID extends ID {
  __PersonID: never;
}

export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER",
}

export type PersonTableRow = Readonly<{
  id: PersonID;
  uuid: UUID;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: EmailAddress;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date | null;
  nationality: CountryCode;
  personalIdentityCode: FinnishPersonalIdentityCode;
  gender: Gender;
}>;

export type PersonTable = {
  id: PersonID;
  UUID: UUID;
  firstName: string;
  lastName: string;
  phone: PhoneNumber | null;
  email: EmailAddress;
  birthday: DateTime;
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
  nationality: CountryCode;
  personalIdentityCode: FinnishPersonalIdentityCode;
  gender: Gender;
};

export const formatPersonRow = (row: PersonTableRow): PersonTable => ({
  id: row.id,
  UUID: row.uuid,
  firstName: row.firstName,
  lastName: row.lastName,
  phone: row.phone ? parsePhoneNumber(row.phone) : null,
  email: row.email,
  birthday: DateTime.fromJSDate(row.birthday),
  nationality: asCountryCode(row.nationality),
  personalIdentityCode: row.personalIdentityCode,
  gender: row.gender as Gender,
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
  gender: Gender;
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
    sort?: SortColumn[];
    queryCursor?: QueryCursor<ValueOf<PersonTable>>[];
    limit: number;
  }): Promise<PersonTable[]> {
    const persons = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .andWhere((qb) => addQueryCursorFilters(qb, params.queryCursor))
      .andWhere((qb) => addPersonFilters(qb, params.filters))
      .limit(params.limit)
      .orderBy(params.sort ? params.sort : [PERSON_DEFAULT_SORT]);

    return persons.map(formatPersonRow);
  },

  async create(params: {
    knex: DBSession;
    person: CreatePersonOptions;
  }): Promise<Try<PersonTable, UniqueConstraintViolationFailure>> {
    const phone = params.person.phone?.formatInternational();
    const birthday = params.person.birthday.toJSDate();

    const person = await withUniqueConstraintHandler(
      async () => {
        const persons = await params
          .knex<PersonTableRow>(Table.PERSONS)
          .insert({
            uuid: createUUID(),
            firstName: params.person.firstName,
            lastName: params.person.lastName,
            phone,
            email: params.person.email,
            birthday,
            gender: params.person.gender,
            personalIdentityCode: params.person.personalIdentityCode,
            nationality: params.person.nationality,
          })
          .returning("*");

        return formatPersonRow(persons[0]);
      },
      (error) => error.toString(),
    );

    if (person instanceof UniqueConstraintViolationFailure) {
      return toFailure(person);
    }

    return toSuccess(person);
  },

  async updateByUUID(params: {
    knex: DBSession;
    personUUID: UUID;
    person: UpdatePersonOptions;
  }): Promise<
    Try<PersonTable, UniqueConstraintViolationFailure | NotFoundFailure>
  > {
    const phone = params.person.phone?.formatInternational();
    const birthday = params.person.birthday.toJSDate();

    const person = await withUniqueConstraintHandler(
      async () => {
        const persons = await params
          .knex(Table.PERSONS)
          .update({
            firstName: params.person.firstName,
            lastName: params.person.lastName,
            phone,
            email: params.person.email,
            birthday,
            gender: params.person.gender,
            personalIdentityCode: params.person.personalIdentityCode,
            nationality: params.person.nationality,
          })
          .where({ uuid: params.personUUID })
          .returning("*");

        if (persons.length === 0) {
          return null;
        }

        return formatPersonRow(persons[0]);
      },
      (error) => error.toString(),
    );
    if (!person) {
      return toFailure(new NotFoundFailure("UUID", "Person not found"));
    }

    if (person instanceof UniqueConstraintViolationFailure) {
      return toFailure(person);
    }

    return toSuccess(person);
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
