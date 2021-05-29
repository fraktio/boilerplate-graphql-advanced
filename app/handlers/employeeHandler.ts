import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import { companyDS, CompanyTable } from "~/database/company/companyDataSource";
import { DBConnection } from "~/database/connection";
import { employeeDS } from "~/database/employee/employeeDataSource";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { personDS } from "~/database/person/personDataSource";
import { UUID } from "~/generation/mappers";
import { toFailure, toSuccess, Try } from "~/utils/validation";

export enum AddEmployeeHandlerErrors {
  InvalidPersonUUID = "invalid-person-uuid",
  InvalidCompanyUUID = "invalid-company-uuid",
}

export const addEmployeeHandler = async (params: {
  knex: DBConnection;
  companyUUID: UUID;
  personUUID: UUID;
  companyDL: CompanyDataLoader;
  personDL: PersonDataLoader;
}): Promise<Try<CompanyTable, AddEmployeeHandlerErrors>> => {
  const company = await companyDS.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    companyDL: params.companyDL,
  });

  if (!company) {
    return toFailure(AddEmployeeHandlerErrors.InvalidCompanyUUID);
  }

  const person = await personDS.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    personDL: params.personDL,
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
  companyDL: CompanyDataLoader;
  personDL: PersonDataLoader;
}): Promise<Try<CompanyTable, RemoveEmployeeHandlerErrors>> => {
  const company = await companyDS.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    companyDL: params.companyDL,
  });

  if (!company) {
    return toFailure(RemoveEmployeeHandlerErrors.InvalidCompanyUUID);
  }

  const person = await personDS.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    personDL: params.personDL,
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
