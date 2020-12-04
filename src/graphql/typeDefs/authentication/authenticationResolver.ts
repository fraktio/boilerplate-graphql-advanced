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
      { dataSources, hashingService, sessionService, res },
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

      const isValidPassword = await hashingService.validatePassword({
        password: input.password,
        hash: user.hashedPassword,
      });

      if (!isValidPassword) {
        return {
          __typename: "LoginUserFailure",
          success: false,
        };
      }

      const { refreshToken } = sessionService.generateRefreshToken({
        user,
      });

      sessionService.setRefreshToken({ res, refreshToken });

      return {
        __typename: "LoginUserSuccess",
        user,
      };
    },

    logout(_, __, { res, sessionService }) {
      sessionService.clearSessions({ res });

      return true;
    },
  },
};
