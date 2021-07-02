import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import { companyDB, CompanyTable } from "~/database/company/companyDatabase";
import { DBSession } from "~/database/connection";
import { CompaniesOfPersonDataLoader } from "~/database/employee/CompaniesOfPersonDataLoader";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { personDB } from "~/database/person/personDatabase";
import {
  CreatePersonOptions,
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

export const personsHandler = async (params: {
  knex: DBSession;
  personDL: PersonDataLoader;
  filters?: PersonFilterOperation;
  sort?: PersonSort[];
}): Promise<PersonTable[]> =>
  await personDB.getAll({
    knex: params.knex,
    personDL: params.personDL,
    filters: params.filters,
    sort: params.sort,
  });

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
