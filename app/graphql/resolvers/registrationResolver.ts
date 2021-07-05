import { Resolvers } from "~/generation/generated";
import {
  registerHandler,
  RegisterHandlerErrors,
} from "~/handlers/registerHandlers";
import { toGraphqlFailure } from "~/utils/validation";

export const registrationResolver: Resolvers = {
  RegisterResponse: {
    __resolveType(registerFailureResponse) {
      return registerFailureResponse.__typename ?? "RegisterFailure";
    },
  },

  Mutation: {
    async register(_, { input }, { knex, dataLoaders, logger }) {
      const createdUser = await registerHandler({
        knex,
        logger,
        newUser: {
          username: input.username,
          email: input.email,
          password: input.password,
          phoneNumber: input.phoneNumber,
        },
        userDL: dataLoaders.userDL,
      });

      if (createdUser.success) {
        return {
          success: true,
          __typename: "RegisterSuccess",
        };
      }

      switch (createdUser.failure) {
        case RegisterHandlerErrors.UsernameAlreadyExists:
          return toGraphqlFailure("RegisterFailureAlreadyExists");

        default:
          return toGraphqlFailure("RegisterFailure");
      }
    },
  },
};
