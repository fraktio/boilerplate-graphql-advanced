import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import { companyDB } from "~/database/company/companyDatabase";
import { CompanyID, CompanyTable } from "~/database/company/companyQueries";
import { DBSession } from "~/database/connection";
import { PersonsOfCompanyDataLoader } from "~/database/employee/PersonsOfCompanyDataLoader";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { personDB } from "~/database/person/personDatabase";
import { PersonTable } from "~/database/person/personQueries";
import { Maybe, PersonFilterOperation } from "~/generation/generated";
import { UUID } from "~/generation/mappers";

export const companiesHandler = async (params: {
  knex: DBSession;
  companyDL: CompanyDataLoader;
  filters?: PersonFilterOperation;
}): Promise<CompanyTable[]> =>
  await companyDB.getAll({
    knex: params.knex,
    companyDL: params.companyDL,
    filters: params.filters,
  });

export const companyHandler = async (params: {
  knex: DBSession;
  companyUUID: UUID;
  companyDL: CompanyDataLoader;
}): Promise<Maybe<CompanyTable>> =>
  await companyDB.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    companyDL: params.companyDL,
  });

type AddCompanyHandlerInput = {
  name: string;
};

export const addCompanyHandler = async (params: {
  knex: DBSession;
  input: AddCompanyHandlerInput;
  companyDL: CompanyDataLoader;
}): Promise<CompanyTable> =>
  await companyDB.create({
    knex: params.knex,
    newCompany: { name: params.input.name },
    companyDL: params.companyDL,
  });

export const editCompanyHandler = async (params: {
  knex: DBSession;
  companyUUID: UUID;
  company: { name: string };
  companyDL: CompanyDataLoader;
}): Promise<Maybe<CompanyTable>> => {
  const company = await companyDB.updateByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    company: { name: params.company.name },
    companyDL: params.companyDL,
  });

  return company;
};

export const companyEmployees = async (params: {
  knex: DBSession;
  companyId: CompanyID;
  personDL: PersonDataLoader;
  personsOfCompanyDL: PersonsOfCompanyDataLoader;
}): Promise<PersonTable[]> =>
  await personDB.getPersonsOfCompany({
    knex: params.knex,
    companyId: params.companyId,
    personDL: params.personDL,
    personsOfCompanyDL: params.personsOfCompanyDL,
  });
