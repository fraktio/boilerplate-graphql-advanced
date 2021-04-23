import { PersonsOfCompanyDataLoader } from "../employee/PersonsOfCompanyDataLoader";

import { PersonDataLoader } from "./PersonDataLoader";

import { CompanyID } from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import {
  CreatePersonOptions,
  personDB,
  PersonID,
  PersonTable,
  UpdatePersonOptions,
} from "~/database/person/personDatabase";
import { PersonFilterOperation } from "~/generation/generated";
import { UUID } from "~/generation/mappers";

export const personDS = {
  async get(params: {
    knex: DBConnection;
    personId: PersonID;
    personDL: PersonDataLoader;
  }) {
    return params.personDL
      .getLoader({ knex: params.knex })
      .load(params.personId);
  },

  async getByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
    personDL: PersonDataLoader;
  }) {
    const person = await personDB.getByUUID(params);

    if (person) {
      params.personDL.getLoader({ knex: params.knex }).prime(person.id, person);
    }

    return person;
  },

  async getAll(params: {
    knex: DBConnection;
    personDL: PersonDataLoader;
    filters?: PersonFilterOperation;
  }) {
    const persons = await personDB.getAll(params);

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
  }) {
    const person = await personDB.create(params);

    params.personDL.getLoader({ knex: params.knex }).prime(person.id, person);

    return person;
  },

  async updateByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
    person: UpdatePersonOptions;
    personDL: PersonDataLoader;
  }) {
    const person = await personDB.updateByUUID(params);

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
  }) {
    const personIds = await params.personsOfCompanyDL
      .getLoader({ knex: params.knex })
      .load(params.companyId);

    return (await params.personDL
      .getLoader({ knex: params.knex })
      .loadMany(personIds)) as PersonTable[];
  },
};
