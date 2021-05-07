import {
  addCompanyHandler,
  companiesHandler,
  companyEmployees,
  companyHandler,
  editCompanyHandler,
} from "../../handlers/companyHandlers";

import { Resolvers } from "~/generation/generated";

export const companyResolver: Resolvers = {
  CompanyOutput: {
    __resolveType(companyOutputResponse) {
      return companyOutputResponse.__typename ?? "CompanyFailureNotFound";
    },
  },

  AddCompanyOutput: {
    __resolveType(registerFailureResponse) {
      return registerFailureResponse.__typename ?? "AddCompanySuccess";
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
    async companies(_, { filters }, { knex, dataLoaders }) {
      return await companiesHandler({
        knex,
        companyDL: dataLoaders.companyDL,
        filters: filters || undefined,
      });
    },

    async company(_, { input }, { knex, dataLoaders }) {
      const company = await companyHandler({
        knex,
        companyUUID: input.UUID,
        companyDL: dataLoaders.companyDL,
      });

      if (!company) {
        return {
          __typename: "CompanyFailureNotFound",
          success: false,
        };
      }

      return {
        __typename: "CompanySuccess",
        company,
      };
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
      const company = await editCompanyHandler({
        knex,
        companyUUID: input.UUID,
        company: { name: input.company.name },
        companyDL: dataLoaders.companyDL,
      });

      if (!company) {
        return {
          __typename: "EditCompanyFailureNotFound",
          success: false,
        };
      }

      return {
        __typename: "EditCompanySuccess",
        company,
      };
    },
  },
};
