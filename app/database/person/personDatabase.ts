import { FinnishSSN } from "finnish-ssn";
import { Knex } from "knex";
import { PhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { DateTime } from "luxon";

import {
  applyDateFilters,
  applyStringFilters,
  InvalidFilterCountError,
} from "../filters";

import { DBConnection } from "~/database/connection";
import { createUUID, ID, Table, tableColumn } from "~/database/tables";
import {
  Maybe,
  PersonFilterOperation,
  PersonFilter,
  FilterOperator,
} from "~/generation/generated";
import { UUID } from "~/generation/mappers";
import {
  CountryCode,
  EmailAddress,
  FinnishPersonalIdentityCode,
} from "~/generation/scalars";
import {
  asCountryCode,
  asFinnishPersonalIdentityCode,
} from "~/validation/converters";

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
  nationality: string;
  personalIdentityCode: string;
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
  nationality: string;
  personalIdentityCode: FinnishSSN;
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
  personalIdentityCode: asFinnishPersonalIdentityCode(row.personalIdentityCode),
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
  personalIndentityCode: FinnishPersonalIdentityCode;
};

export type UpdatePersonOptions = CreatePersonOptions;

export const personDB = {
  async get(params: {
    knex: DBConnection;
    id: PersonID;
  }): Promise<Maybe<PersonTable>> {
    const person = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .where({ id: params.id })
      .first();

    return person ? formatPersonRow(person) : null;
  },

  async getByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
  }): Promise<Maybe<PersonTable>> {
    const person = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .where({ uuid: params.personUUID })
      .first();

    return person ? formatPersonRow(person) : null;
  },

  async getAll(params: {
    knex: DBConnection;
    filters?: PersonFilterOperation;
  }): Promise<PersonTable[]> {
    const persons = await params
      .knex<PersonTableRow>(Table.PERSONS)
      .andWhere((qb) => addPersonFilters(qb, params.filters));

    return persons.map(formatPersonRow);
  },

  async create(params: {
    knex: DBConnection;
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
    knex: DBConnection;
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
  },

  async getPersonsByIds(params: {
    knex: DBConnection;
    personIds: readonly PersonID[];
  }) {
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
  if (!filterOperation) {
    return queryBuilder;
  }

  if (!filterOperation.filters) {
    return queryBuilder;
  }

  filterOperation.filters.forEach((filterField) => {
    getFilter(queryBuilder, filterOperation.operator, filterField);
  });

  const ops = filterOperation.filterOperation;
  if (ops) {
    if (filterOperation.operator === FilterOperator.Or) {
      queryBuilder.orWhere((qb) => addPersonFilters(qb, ops));
    } else {
      queryBuilder.andWhere((qb) => addPersonFilters(qb, ops));
    }
  }

  return queryBuilder;
}

function getFilter(
  queryBuilder: Knex.QueryBuilder,
  filterOperator: FilterOperator,
  personFilter: PersonFilter,
): Knex.QueryBuilder {
  if (personFilter.birthdayFilter) {
    applyDateFilters({
      queryBuilder,
      filterOperator,
      field: tableColumn(Table.PERSONS, "birthday"),
      dateFilter: personFilter.birthdayFilter,
    });
  }
  if (personFilter.nameFilter) {
    return applyStringFilters({
      queryBuilder,
      filterOperator,
      field: tableColumn(Table.PERSONS, "firstName"),
      stringFilter: personFilter.nameFilter,
    });
  }

  return queryBuilder;
}

export function enforceOneFilter(filter: PersonFilter) {
  const keys = Object.keys(filter);
  if (keys.length === 0) {
    throw new InvalidFilterCountError(`Invalid filter count ${keys.length}`);
  }

  return filter;
}
