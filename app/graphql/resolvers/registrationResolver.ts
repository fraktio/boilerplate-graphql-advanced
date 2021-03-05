import {
  registerHandler,
  RegisterHandlerErrors,
} from "../handlers/registerHandlers";

import { Resolvers } from "~/generated/graphql";

export const registrationResolver: Resolvers = {
  RegisterResponse: {
    __resolveType(registerFailureResponse) {
      return registerFailureResponse.__typename ?? "RegisterFailure";
    },
  },

  Mutation: {
    async register(_, { input }, { knex }) {
      const createdUser = await registerHandler({
        knex,
        newUser: {
          username: input.username,
          email: input.email,
          password: input.password,
          phoneNumber: input.phoneNumber,
        },
      });

      if (createdUser.success) {
        return {
          success: true,
          __typename: "RegisterSuccess",
        };
      }

      switch (createdUser.failure) {
        case RegisterHandlerErrors.UsernameAlreadyExists:
          return {
            success: false,
            __typename: "RegisterFailure",
          };
      }
    },
  },
};
