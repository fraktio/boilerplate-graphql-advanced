import { Resolvers } from "~/generated/graphql";

export const employeeResolver: Resolvers = {
  AddEmployeeOutput: {
    __resolveType(registerFailureResponse) {
      return registerFailureResponse.__typename ?? "AddEmployeeSuccess";
    },
  },

  RemoveEmployeeOutput: {
    __resolveType(registerFailureResponse) {
      return registerFailureResponse.__typename ?? "RemoveEmployeeSuccess";
    },
  },

  Mutation: {
    async addEmployee(_, { input }, { dataSources }) {
      const company = await dataSources.companyDS.getCompany({
        uuid: input.companyUuid,
      });

      if (!company) {
        throw new Error("Invalid company uuid");
      }

      const person = await dataSources.personDS.getPerson({
        uuid: input.personUuid,
      });

      if (!person) {
        throw new Error("Invalid person uuid");
      }

      await dataSources.employeeDS.createEmployee({
        companyId: company.id,
        personId: person.id,
      });

      return {
        __typename: "AddEmployeeSuccess",
        company,
      };
    },

    async removeEmployee(_, { input }, { dataSources }) {
      const company = await dataSources.companyDS.getCompany({
        uuid: input.companyUuid,
      });

      if (!company) {
        throw new Error("Invalid company uuid");
      }

      const person = await dataSources.personDS.getPerson({
        uuid: input.personUuid,
      });

      if (!person) {
        throw new Error("Invalid person uuid");
      }

      await dataSources.employeeDS.removeEmployee({
        companyId: company.id,
        personId: person.id,
      });

      return {
        __typename: "RemoveEmployeeSuccess",
        company,
      };
    },
  },
};
