import { companyDB } from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { personDS } from "~/database/person/personDataSource";
import {
  CreatePersonOptions,
  PersonID,
  UpdatePersonOptions,
} from "~/database/person/personDatabase";
import { UUID } from "~/generation/mappers";

export const personHandler = async (params: {
  knex: DBConnection;
  personUUID: UUID;
  personDL: PersonDataLoader;
}) =>
  await personDS.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    personDL: params.personDL,
  });

export const personsHandler = async (params: {
  knex: DBConnection;
  personDL: PersonDataLoader;
}) => await personDS.getAll({ knex: params.knex, personDL: params.personDL });

export const addPersonHandler = async (params: {
  knex: DBConnection;
  person: CreatePersonOptions;
  personDL: PersonDataLoader;
}) =>
  await personDS.create({
    knex: params.knex,
    person: params.person,
    personDL: params.personDL,
  });

export const modifyPerson = async (params: {
  knex: DBConnection;
  personUUID: UUID;
  modifiedPerson: UpdatePersonOptions;
  personDL: PersonDataLoader;
}) =>
  await personDS.updateByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    person: params.modifiedPerson,
    personDL: params.personDL,
  });

export const adultEmployersHandler = async (params: {
  knex: DBConnection;
  personId: PersonID;
}) =>
  await companyDB.getCompaniesOfPerson({
    knex: params.knex,
    personId: params.personId,
  });
