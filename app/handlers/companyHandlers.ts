import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import { companyDS } from "~/database/company/companyDataSource";
import { CompanyID } from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import { PersonsOfCompanyDataLoader } from "~/database/employee/PersonsOfCompanyDataLoader";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { personDS } from "~/database/person/personDataSource";
import { PersonFilterOperation } from "~/generation/generated";
import { UUID } from "~/generation/mappers";

export const companiesHandler = async (params: {
  knex: DBConnection;
  companyDL: CompanyDataLoader;
  filters?: PersonFilterOperation;
}) =>
  await companyDS.getAll({
    knex: params.knex,
    companyDL: params.companyDL,
    filters: params.filters,
  });

export const companyHandler = async (params: {
  knex: DBConnection;
  companyUUID: UUID;
  companyDL: CompanyDataLoader;
}) =>
  await companyDS.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    companyDL: params.companyDL,
  });

type AddCompanyHandlerInput = {
  name: string;
};

export const addCompanyHandler = async (params: {
  knex: DBConnection;
  input: AddCompanyHandlerInput;
  companyDL: CompanyDataLoader;
}) =>
  await companyDS.create({
    knex: params.knex,
    newCompany: { name: params.input.name },
    companyDL: params.companyDL,
  });

export const editCompanyHandler = async (params: {
  knex: DBConnection;
  companyUUID: UUID;
  company: { name: string };
  companyDL: CompanyDataLoader;
}) => {
  const company = await companyDS.updateByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    company: { name: params.company.name },
    companyDL: params.companyDL,
  });

  return company;
};

export const companyEmployees = async (params: {
  knex: DBConnection;
  companyId: CompanyID;
  personDL: PersonDataLoader;
  personsOfCompanyDL: PersonsOfCompanyDataLoader;
}) =>
  await personDS.getPersonsOfCompany({
    knex: params.knex,
    companyId: params.companyId,
    personDL: params.personDL,
    personsOfCompanyDL: params.personsOfCompanyDL,
  });
