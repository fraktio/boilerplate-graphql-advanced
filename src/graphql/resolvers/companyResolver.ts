import { UserInputError } from "apollo-server-express";

import { Resolvers } from "~/generated/graphql";

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
    async employees(company, __, { dataSources }) {
      return await dataSources.personDS.getPersonsOfCompany({
        uuid: company.uuid,
      });
    },
  },

  Query: {
    async companies(_, __, { dataSources }) {
      return dataSources.companyDS.getCompanies();
    },

    async company(_, { input }, { dataSources }) {
      const company = await dataSources.companyDS.getCompany({
        uuid: input.uuid,
      });

      if (!company) {
        throw new UserInputError(`Invalid company id: ${input.uuid}`);
      }

      return company;
    },
  },

  Mutation: {
    async addCompany(_, { input }, { dataSources }) {
      const company = await dataSources.companyDS.addCompany({
        company: { name: input.company.name },
      });

      return {
        __typename: "AddCompanySuccess",
        company,
      };
    },

    async editCompany(_, { input }, { dataSources }) {
      const company = await dataSources.companyDS.updateCompany({
        company: { uuid: input.uuid, name: input.company.name },
      });

      if (!company) {
        throw new UserInputError(`Invalid company id: ${input.uuid}`);
      }

      return {
        __typename: "EditCompanySuccess",
        company,
      };
    },
  },
};
