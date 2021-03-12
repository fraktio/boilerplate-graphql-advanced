import { UserInputError } from "apollo-server-express";

import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import { companyDS } from "~/database/company/companyDataSource";
import { CompanyID } from "~/database/company/companyDatabase";
import { DBConnection } from "~/database/connection";
import { personDS } from "~/database/person/personDataSource";
import { UUID } from "~/graphql/generation/mappers";

export const companiesHandler = async (params: {
  knex: DBConnection;
  companyDL: CompanyDataLoader;
}) =>
  await companyDS.getAll({ knex: params.knex, companyDL: params.companyDL });

export const companyHandler = async (params: {
  knex: DBConnection;
  companyUUID: UUID;
  companyDL: CompanyDataLoader;
}) => {
  const company = await companyDS.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    companyDL: params.companyDL,
  });

  if (!company) {
    throw new UserInputError(`Invalid company UUID: ${params.companyUUID}`);
  }

  return company;
};

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

  if (!company) {
    throw new UserInputError(`Invalid company id: ${params.companyUUID}`);
  }

  return company;
};

export const companyEmployees = async (params: {
  knex: DBConnection;
  companyId: CompanyID;
}) =>
  await personDS.getPersonsOfCompany({
    knex: params.knex,
    companyId: params.companyId,
  });
