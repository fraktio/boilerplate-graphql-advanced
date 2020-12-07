import { UserInputError } from "apollo-server-express";

import { PersonTable } from "~/dataSources/PersonDataSource";
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
    async employees(company, __, { dataLoaders }) {
      const personUUIDs = await dataLoaders.personDL.personsOfCompany.load(
        company.UUID,
      );

      const persons = (await dataLoaders.personDL.person.loadMany(
        personUUIDs,
      )) as PersonTable[];

      return persons;
    },
  },

  Query: {
    async companies(_, __, { dataSources }) {
      return dataSources.companyDS.getCompanies();
    },

    async company(_, { input }, { dataLoaders }) {
      const company = await dataLoaders.companyDL.company.load(input.UUID);

      if (!company) {
        throw new UserInputError(`Invalid company id: ${input.UUID}`);
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
        company: { UUID: input.UUID, name: input.company.name },
      });

      if (!company) {
        throw new UserInputError(`Invalid company id: ${input.UUID}`);
      }

      return {
        __typename: "EditCompanySuccess",
        company,
      };
    },
  },
};
