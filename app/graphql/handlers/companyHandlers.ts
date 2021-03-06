import { UserInputError } from "apollo-server-express";

import { companyDS } from "~/dataSources/company/companyDataSource";
import { CompanyID } from "~/dataSources/company/companyDatabase";
import { personDS } from "~/dataSources/person/personDataSource";
import { DBConnection } from "~/database/connection";
import { UUID } from "~/models";

export const companiesHandler = async (params: { knex: DBConnection }) =>
  await companyDS.getAll({ knex: params.knex });

export const companyHandler = async (params: {
  knex: DBConnection;
  companyUUID: UUID;
}) => {
  const company = await companyDS.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
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
}) =>
  await companyDS.create({
    knex: params.knex,
    newCompany: { name: params.input.name },
  });

export const editCompanyHandler = async (params: {
  knex: DBConnection;
  companyUUID: UUID;
  company: { name: string };
}) => {
  const company = await companyDS.updateByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    company: { name: params.company.name },
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
