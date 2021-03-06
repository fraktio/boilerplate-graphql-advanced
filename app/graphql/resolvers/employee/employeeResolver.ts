import {
  addEmployeeHandler,
  AddEmployeeHandlerErrors,
  removeEmployeeHandler,
  RemoveEmployeeHandlerErrors,
} from "./employeeHandler";

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
    async addEmployee(_, { input }, { knex }) {
      const employee = await addEmployeeHandler({
        knex,
        companyUUID: input.companyUUID,
        personUUID: input.personUUID,
      });

      if (employee.success) {
        return {
          __typename: "AddEmployeeSuccess",
          company: employee.value,
        };
      }

      switch (employee.failure) {
        case AddEmployeeHandlerErrors.InvalidCompanyUUID:
          throw new Error("Invalid person uuid");

        case AddEmployeeHandlerErrors.InvalidPersonUUID:
          throw new Error("Invalid person uuid");
      }
    },

    async removeEmployee(_, { input }, { knex }) {
      const employee = await removeEmployeeHandler({
        knex,
        companyUUID: input.companyUUID,
        personUUID: input.personUUID,
      });

      if (employee.success) {
        return {
          __typename: "RemoveEmployeeSuccess",
          company: employee.value,
        };
      }

      switch (employee.failure) {
        case RemoveEmployeeHandlerErrors.InvalidCompanyUUID:
          throw new Error("Invalid company uuid");

        case RemoveEmployeeHandlerErrors.InvalidPersonUUID:
          throw new Error("Invalid person uuid");
      }
    },
  },
};
