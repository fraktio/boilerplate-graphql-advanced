import { personDS } from "~/dataSources/PersonDataSource";
import { companyDB } from "~/database/companyDB";
import { DBConnection } from "~/database/connection";
import {
  CreatePersonOptions,
  PersonID,
  UpdatePersonOptions,
} from "~/database/personDB";
import { UUID } from "~/models";

export const personHandler = async (params: {
  knex: DBConnection;
  personUUID: UUID;
}) =>
  await personDS.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
  });

export const personsHandler = async (params: { knex: DBConnection }) =>
  await personDS.getAll({ knex: params.knex });

export const addPersonHandler = async (params: {
  knex: DBConnection;
  person: CreatePersonOptions;
}) =>
  await personDS.create({
    knex: params.knex,
    person: params.person,
  });

export const modifyPerson = async (params: {
  knex: DBConnection;
  personUUID: UUID;
  modifiedPerson: UpdatePersonOptions;
}) =>
  await personDS.updateByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    person: params.modifiedPerson,
  });

export const adultEmployersHandler = async (params: {
  knex: DBConnection;
  personId: PersonID;
}) =>
  await companyDB.getCompaniesOfPerson({
    knex: params.knex,
    personId: params.personId,
  });
