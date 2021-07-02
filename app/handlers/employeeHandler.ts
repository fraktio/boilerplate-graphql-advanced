import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import { companyDB, CompanyTable } from "~/database/company/companyDatabase";
import { DBSession } from "~/database/connection";
import { employeeDB } from "~/database/employee/employeeDatabase";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { personDB } from "~/database/person/personDatabase";
import { UUID } from "~/generation/mappers";
import { toFailure, toSuccess, Try } from "~/utils/validation";

export enum AddEmployeeHandlerErrors {
  InvalidPersonUUID = "invalid-person-uuid",
  InvalidCompanyUUID = "invalid-company-uuid",
}

export const addEmployeeHandler = async (params: {
  knex: DBSession;
  companyUUID: UUID;
  personUUID: UUID;
  companyDL: CompanyDataLoader;
  personDL: PersonDataLoader;
}): Promise<Try<CompanyTable, AddEmployeeHandlerErrors>> => {
  const company = await companyDB.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    companyDL: params.companyDL,
  });

  if (!company) {
    return toFailure(AddEmployeeHandlerErrors.InvalidCompanyUUID);
  }

  const person = await personDB.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    personDL: params.personDL,
  });

  if (!person) {
    return toFailure(AddEmployeeHandlerErrors.InvalidPersonUUID);
  }

  await employeeDB.create({
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
  knex: DBSession;
  companyUUID: UUID;
  personUUID: UUID;
  companyDL: CompanyDataLoader;
  personDL: PersonDataLoader;
}): Promise<Try<CompanyTable, RemoveEmployeeHandlerErrors>> => {
  const company = await companyDB.getByUUID({
    knex: params.knex,
    companyUUID: params.companyUUID,
    companyDL: params.companyDL,
  });

  if (!company) {
    return toFailure(RemoveEmployeeHandlerErrors.InvalidCompanyUUID);
  }

  const person = await personDB.getByUUID({
    knex: params.knex,
    personUUID: params.personUUID,
    personDL: params.personDL,
  });

  if (!person) {
    return toFailure(RemoveEmployeeHandlerErrors.InvalidCompanyUUID);
  }

  await employeeDB.remove({
    knex: params.knex,
    companyId: company.id,
    personId: person.id,
  });

  return toSuccess(company);
};
