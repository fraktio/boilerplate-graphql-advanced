import { UserInputError } from "apollo-server-express";

import {
  addCompanyHandler,
  companiesHandler,
  companyEmployees,
  companyHandler,
  editCompanyHandler,
} from "../../handlers/companyHandlers";

import { Resolvers } from "~/generation/generated";

export const companyResolver: Resolvers = {
  AddCompanyOutput: {
    __resolveType(registerFailureResponse) {
      return (
        registerFailureResponse.__typename ?? "UniqueConstraintViolationFailure"
      );
    },
  },

  EditCompanyOutput: {
    __resolveType(registerFailureResponse) {
      return registerFailureResponse.__typename ?? "EditCompanySuccess";
    },
  },

  Company: {
    async employees(company, __, { knex, dataLoaders }) {
      return companyEmployees({
        knex,
        companyId: company.id,
        personDL: dataLoaders.personDL,
        personsOfCompanyDL: dataLoaders.personsOfCompanyDL,
      });
    },
  },

  Query: {
    async companies(_, __, { knex, dataLoaders }) {
      return await companiesHandler({ knex, companyDL: dataLoaders.companyDL });
    },

    async company(_, { input }, { knex, dataLoaders }) {
      return await companyHandler({
        knex,
        companyUUID: input.UUID,
        companyDL: dataLoaders.companyDL,
      });
    },
  },

  Mutation: {
    async addCompany(_, { input }, { knex, dataLoaders }) {
      const company = addCompanyHandler({
        knex,
        input: { name: input.company.name },
        companyDL: dataLoaders.companyDL,
      });

      return {
        __typename: "AddCompanySuccess",
        company,
      };
    },

    async editCompany(_, { input }, { knex, dataLoaders }) {
      const company = editCompanyHandler({
        knex,
        companyUUID: input.UUID,
        company: { name: input.company.name },
        companyDL: dataLoaders.companyDL,
      });

      if (!company) {
        throw new UserInputError(`Invalid company uuid: ${input.UUID}`);
      }

      return {
        __typename: "EditCompanySuccess",
        company,
      };
    },
  },
};
