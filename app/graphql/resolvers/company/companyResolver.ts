import { UserInputError } from "apollo-server-express";

import {
  addCompanyHandler,
  companiesHandler,
  companyEmployees,
  companyHandler,
  editCompanyHandler,
} from "./companyHandlers";

import { Resolvers } from "~/graphql/generation/generated";

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
    async employees(company, __, { knex }) {
      return companyEmployees({ knex, companyId: company.id });
    },
  },

  Query: {
    async companies(_, __, { knex }) {
      return await companiesHandler({ knex });
    },

    async company(_, { input }, { knex }) {
      return await companyHandler({ knex, companyUUID: input.UUID });
    },
  },

  Mutation: {
    async addCompany(_, { input }, { knex }) {
      const company = addCompanyHandler({
        knex,
        input: { name: input.company.name },
      });

      return {
        __typename: "AddCompanySuccess",
        company,
      };
    },

    async editCompany(_, { input }, { knex }) {
      const company = editCompanyHandler({
        knex,
        companyUUID: input.UUID,
        company: { name: input.company.name },
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
