import { companyDS } from "~/dataSources/company/companyDataSource";
import { employeeDS } from "~/dataSources/employee/employeeDataSource";
import { personDS } from "~/dataSources/person/personDataSource";
import { DBConnection } from "~/database/connection";
import { UUID } from "~/models";
import { toFailure, toSuccess } from "~/validation/common";

export enum AddEmployeeHandlerErrors {
  InvalidPersonUUID = "invalid-person-uuid",
  InvalidCompanyUUID = "invalid-company-uuid",
}

export const addEmployeeHandler = async (params: {
  knex: DBConnection;
  companyUUID: UUID;
  personUUID: UUID;
}) => {
  const company = await companyDS.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
  });

  if (!company) {
    return toFailure(AddEmployeeHandlerErrors.InvalidCompanyUUID);
  }

  const person = await personDS.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
  });

  if (!person) {
    return toFailure(AddEmployeeHandlerErrors.InvalidPersonUUID);
  }

  await employeeDS.create({
    knex: params.knex,
    companyId: company.id,
    personId: person.id,
  });

  return toSuccess(company);
};

export enum RemoveEmployeeHandlerErrors {
  InvalidPersonUUID = "invalid-person-uuid",
  InvalidCompanyUUID = "invalid-company-uuid",
}

export const removeEmployeeHandler = async (params: {
  knex: DBConnection;
  companyUUID: UUID;
  personUUID: UUID;
}) => {
  const company = await companyDS.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
  });

  if (!company) {
    return toFailure(RemoveEmployeeHandlerErrors.InvalidCompanyUUID);
  }

  const person = await personDS.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
  });

  if (!person) {
    return toFailure(RemoveEmployeeHandlerErrors.InvalidCompanyUUID);
  }

  await employeeDS.remove({
    knex: params.knex,
    companyId: company.id,
    personId: person.id,
  });

  return toSuccess(company);
};
