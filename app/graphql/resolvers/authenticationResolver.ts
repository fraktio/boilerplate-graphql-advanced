import { Resolvers } from "~/generated/graphql";
import {
  loginHandler,
  LogInHandlerErrors,
  logoutHandler,
} from "~/graphql/handlers/authenticationHandlers";

export const authenticationResolver: Resolvers = {
  LoginUserResponse: {
    __resolveType(loginuserResponse) {
      return loginuserResponse.__typename ?? "LoginUserFailure";
    },
  },

  Mutation: {
    async login(_, { input }, { knex, res, config }) {
      const response = await loginHandler({
        knex,
        res,
        input,
        cookiesConfig: config.cookies,
      });

      if (response.success) {
        return {
          __typename: "LoginUserSuccess",
          user: response.value,
        };
      }

      switch (response.failure) {
        case LogInHandlerErrors.UserNotFound:
          return {
            __typename: "LoginUserFailure",
            success: false,
          };

        case LogInHandlerErrors.InvalidPassword:
          return {
            __typename: "LoginUserFailure",
            success: false,
          };
      }
    },

    logout(_, __, { res, config }) {
      logoutHandler({ res, cookiesConfig: config.cookies });

      return true;
    },
  },
};
