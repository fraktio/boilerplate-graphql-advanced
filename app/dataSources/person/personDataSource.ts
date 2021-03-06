import { CompanyID } from "~/dataSources/company/companyDatabase";
import {
  CreatePersonOptions,
  personDB,
  PersonID,
  UpdatePersonOptions,
} from "~/dataSources/person/personDatabase";
import { DBConnection } from "~/database/connection";
import { UUID } from "~/models";

export const personDS = {
  async get(params: { knex: DBConnection; id: PersonID }) {
    return await personDB.get(params);
  },

  async getByUUID(params: { knex: DBConnection; personUUID: UUID }) {
    return await personDB.getByUUID(params);
  },

  async getAll(params: { knex: DBConnection }) {
    return await personDB.getAll(params);
  },

  async create(params: { knex: DBConnection; person: CreatePersonOptions }) {
    return await personDB.create(params);
  },

  async updateByUUID(params: {
    knex: DBConnection;
    personUUID: UUID;
    person: UpdatePersonOptions;
  }) {
    return await personDB.updateByUUID(params);
  },

  async getPersonsOfCompany(params: {
    knex: DBConnection;
    companyId: CompanyID;
  }) {
    return await personDB.getPersonsOfCompany(params);
  },
};
