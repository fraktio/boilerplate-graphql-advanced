import { Resolvers } from "~/generated/graphql";
import {
  loginHandler,
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
      return await loginHandler({ knex, res, input, config });
    },

    logout(_, __, { res, config }) {
      logoutHandler({ res, config });

      return true;
    },
  },
};
