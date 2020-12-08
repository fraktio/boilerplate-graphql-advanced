import { Resolvers } from "~/generated/graphql";

export const authenticationResolver: Resolvers = {
  LoginUserResponse: {
    __resolveType(loginuserResponse) {
      return loginuserResponse.__typename ?? "LoginUserFailure";
    },
  },

  Mutation: {
    async login(
      _,
      { input },
      { dataSources, hashingUtils, sessionUtils, res },
    ) {
      const user = await dataSources.userDS.getUser({
        username: input.username,
      });

      if (!user) {
        return {
          __typename: "LoginUserFailure",
          success: false,
        };
      }

      const isValidPassword = await hashingUtils.validatePassword({
        password: input.password,
        hash: user.hashedPassword,
      });

      if (!isValidPassword) {
        return {
          __typename: "LoginUserFailure",
          success: false,
        };
      }

      const { refreshToken } = sessionUtils.generateRefreshToken({
        user,
      });

      sessionUtils.setRefreshToken({ res, refreshToken });

      return {
        __typename: "LoginUserSuccess",
        user,
      };
    },

    logout(_, __, { res, sessionUtils }) {
      sessionUtils.clearSessions({ res });

      return true;
    },
  },
};
