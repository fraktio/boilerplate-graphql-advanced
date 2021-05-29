import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import { companyDS, CompanyTable } from "~/database/company/companyDataSource";
import { DBConnection } from "~/database/connection";
import { CompaniesOfPersonDataLoader } from "~/database/employee/CompaniesOfPersonDataLoader";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { personDS } from "~/database/person/personDataSource";
import {
  CreatePersonOptions,
  PersonID,
  PersonTable,
  UpdatePersonOptions,
} from "~/database/person/personDatabase";
import {
  Maybe,
  PersonFilterOperation,
  PersonSort,
} from "~/generation/generated";
import { UUID } from "~/generation/mappers";

export const personHandler = async (params: {
  knex: DBConnection;
  personUUID: UUID;
  personDL: PersonDataLoader;
}): Promise<Maybe<PersonTable>> =>
  await personDS.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    personDL: params.personDL,
  });

export const personsHandler = async (params: {
  knex: DBConnection;
  personDL: PersonDataLoader;
  filters?: PersonFilterOperation;
  sort?: PersonSort[];
}): Promise<PersonTable[]> =>
  await personDS.getAll({
    knex: params.knex,
    personDL: params.personDL,
    filters: params.filters,
    sort: params.sort,
  });

export const addPersonHandler = async (params: {
  knex: DBConnection;
  person: CreatePersonOptions;
  personDL: PersonDataLoader;
}): Promise<PersonTable> =>
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
}): Promise<Maybe<PersonTable>> =>
  await personDS.updateByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    person: params.modifiedPerson,
    personDL: params.personDL,
  });

export const adultEmployersHandler = async (params: {
  knex: DBConnection;
  personId: PersonID;
  companyDL: CompanyDataLoader;
  companiesOfPersonDL: CompaniesOfPersonDataLoader;
}): Promise<CompanyTable[]> =>
  await companyDS.getCompaniesOfPerson({
    knex: params.knex,
    personId: params.personId,
    companyDL: params.companyDL,
    companiesOfPersonDL: params.companiesOfPersonDL,
  });
