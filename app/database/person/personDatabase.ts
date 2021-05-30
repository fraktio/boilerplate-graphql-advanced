import { PersonsOfCompanyDataLoader } from "../employee/PersonsOfCompanyDataLoader";

import { PersonDataLoader } from "./PersonDataLoader";

import { CompanyID } from "~/database/company/companyQueries";
import { DBConnection } from "~/database/connection";
import {
  CreatePersonOptions,
  personQueries,
  PersonID,
  PersonTable,
  UpdatePersonOptions,
} from "~/database/person/personQueries";
import {
  Maybe,
  PersonFilterOperation,
  PersonSort,
} from "~/generation/generated";
import { UUID } from "~/generation/mappers";

export const personDB = {
  async get(params: {
    knex: DBConnection;
    personId: PersonID;
    personDL: PersonDataLoader;
  }): Promise<Maybe<PersonTable>> {
    return params.personDL
      .getLoader({ knex: params.knex })
      .load(params.personId);
  },

  async getByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
    personDL: PersonDataLoader;
  }): Promise<Maybe<PersonTable>> {
    const person = await personQueries.getByUUID(params);

    if (person) {
      params.personDL.getLoader({ knex: params.knex }).prime(person.id, person);
    }

    return person;
  },

  async getAll(params: {
    knex: DBConnection;
    personDL: PersonDataLoader;
    filters?: PersonFilterOperation;
    sort?: PersonSort[];
  }): Promise<PersonTable[]> {
    const persons = await personQueries.getAll(params);

    persons.forEach((person) => {
      const dataLoader = params.personDL.getLoader({ knex: params.knex });
      dataLoader.prime(person.id, person);
    });

    return persons;
  },

  async create(params: {
    knex: DBConnection;
    person: CreatePersonOptions;
    personDL: PersonDataLoader;
  }): Promise<PersonTable> {
    const person = await personQueries.create(params);

    params.personDL.getLoader({ knex: params.knex }).prime(person.id, person);

    return person;
  },

  async updateByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
    person: UpdatePersonOptions;
    personDL: PersonDataLoader;
  }): Promise<Maybe<PersonTable>> {
    const person = await personQueries.updateByUUID(params);

    if (person) {
      params.personDL.getLoader({ knex: params.knex }).prime(person.id, person);
    }

    return person;
  },

  async getPersonsOfCompany(params: {
    knex: DBConnection;
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
