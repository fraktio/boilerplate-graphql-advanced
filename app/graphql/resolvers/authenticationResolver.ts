import { Resolvers } from "~/generation/generated";
import {
  authenticatedUserHandler,
  loginHandler,
  LogInHandlerErrors,
  logoutHandler,
} from "~/handlers/authenticationHandlers";
import { toGraphqlFailure } from "~/utils/validation";

export const authenticationResolver: Resolvers = {
  LoginUserResponse: {
    __resolveType(loginuserResponse) {
      return loginuserResponse.__typename ?? "LoginUserFailure";
    },
  },

  AuthenticatedUserResponse: {
    __resolveType(authenticatedUserResponse) {
      return authenticatedUserResponse.__typename ?? "AuthenticatedUserFailure";
    },
  },

  Query: {
    async authenticatedUser(_, __, { authenticatedUser }) {
      if (!authenticatedUser) {
        return toGraphqlFailure("AuthenticatedUserFailure");
      }

      const user = await authenticatedUserHandler({ authenticatedUser });

      if (user) {
        return {
          __typename: "AuthenticatedUserSuccess",
          user,
        };
      }

      return toGraphqlFailure("AuthenticatedUserFailure");
    },
  },

  Mutation: {
    async login(_, { input }, { knex, res, config, dataLoaders }) {
      const response = await loginHandler({
        knex,
        res,
        input,
        sessionConfig: config.session,
        envConfig: config.env,
        userDL: dataLoaders.userDL,
      });

      if (response.success) {
        return {
          __typename: "LoginUserSuccess",
          token: response.value.token,
          user: response.value.user,
        };
      }

      switch (response.failure) {
        case LogInHandlerErrors.UserNotFound:
        case LogInHandlerErrors.InvalidPassword:
        default:
          return toGraphqlFailure("LoginUserFailure");
      }
    },

    logout(_, __, { res, config }) {
      logoutHandler({ res, sessionConfig: config.session });

      return true;
    },
  },
};
