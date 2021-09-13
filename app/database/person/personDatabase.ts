import { Maybe, ValueOf } from "~/@types/global";
import { CompanyID } from "~/database/company/companyQueries";
import { DBSession } from "~/database/connection";
import { PersonsOfCompanyDataLoader } from "~/database/employee/PersonsOfCompanyDataLoader";
import { NotFoundError } from "~/database/error/NotFoundError";
import { QueryCursor } from "~/database/pagination";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { PersonFilterOperation } from "~/database/person/personFilters";
import {
  CreatePersonOptions,
  personQueries,
  PersonID,
  PersonTable,
  UpdatePersonOptions,
} from "~/database/person/personQueries";
import { SortColumn } from "~/database/sort";
import { UUID } from "~/generation/mappers";
import { NotFoundFailure } from "~/handlers/failures/NotFoundFailure";
import { UniqueConstraintViolationFailure } from "~/handlers/failures/UniqueConstraintViolationFailure";
import { Try } from "~/utils/validation";

export const personDB = {
  async get(params: {
    knex: DBSession;
    personId: PersonID;
    personDL: PersonDataLoader;
  }): Promise<Maybe<PersonTable>> {
    return params.personDL
      .getLoader({ knex: params.knex })
      .load(params.personId);
  },

  async getByUUID(params: {
    knex: DBSession;
    personUUID: UUID;
    personDL: PersonDataLoader;
  }): Promise<Maybe<PersonTable>> {
    const person = await personQueries.getByUUID(params);

    if (person) {
      params.personDL.getLoader({ knex: params.knex }).prime(person.id, person);
    }

    return person;
  },

  async tryGetByUUID(params: {
    knex: DBSession;
    personUUID: UUID;
    personDL: PersonDataLoader;
  }): Promise<PersonTable> {
    const person = await this.getByUUID(params);
    if (!person) {
      throw new NotFoundError(`Invalid person UUID: ${params.personUUID}`);
    }

    return person;
  },

  async getAll(params: {
    knex: DBSession;
    personDL: PersonDataLoader;
    filters?: PersonFilterOperation;
    sort?: SortColumn[];
    queryCursor?: QueryCursor<ValueOf<PersonTable>>[];
    limit: number;
  }): Promise<PersonTable[]> {
    const persons = await personQueries.getAll(params);

    persons.forEach((person) => {
      const dataLoader = params.personDL.getLoader({ knex: params.knex });
      dataLoader.prime(person.id, person);
    });

    return persons;
  },

  async create(params: {
    knex: DBSession;
    person: CreatePersonOptions;
    personDL: PersonDataLoader;
  }): Promise<Try<PersonTable, UniqueConstraintViolationFailure>> {
    const personResult = await personQueries.create(params);

    if (personResult.success) {
      params.personDL
        .getLoader({ knex: params.knex })
        .prime(personResult.value.id, personResult.value);
    }

    return personResult;
  },

  async updateByUUID(params: {
    knex: DBSession;
    personUUID: UUID;
    person: UpdatePersonOptions;
    personDL: PersonDataLoader;
  }): Promise<
    Try<PersonTable, UniqueConstraintViolationFailure | NotFoundFailure>
  > {
    const personResult = await personQueries.updateByUUID(params);

    if (personResult.success) {
      const person = personResult.value;
      params.personDL.getLoader({ knex: params.knex }).prime(person.id, person);
    }

    return personResult;
  },

  async getPersonsOfCompany(params: {
    knex: DBSession;
    companyId: CompanyID;
    personDL: PersonDataLoader;
    personsOfCompanyDL: PersonsOfCompanyDataLoader;
  }): Promise<PersonTable[]> {
    const personIds = await params.personsOfCompanyDL
      .getLoader({ knex: params.knex })
      .load(params.companyId);

    return (await params.personDL
      .getLoader({ knex: params.knex })
      .loadMany(personIds)) as PersonTable[];
  },
};
