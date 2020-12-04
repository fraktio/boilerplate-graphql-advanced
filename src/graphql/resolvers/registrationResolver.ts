import { Resolvers } from "~/generated/graphql";

export const registrationResolver: Resolvers = {
  RegisterResponse: {
    __resolveType(registerFailureResponse) {
      return registerFailureResponse.__typename ?? "RegisterFailure";
    },
  },

  Mutation: {
    async register(_, { input }, { dataSources, hashingUtils }) {
      const user = await dataSources.userDS.getUser({
        username: input.username,
      });

      if (user) {
        return {
          success: false,
          __typename: "RegisterFailureAlreadyExists",
        };
      }

      const hashedPassword = await hashingUtils.hashPassword({
        password: input.password,
      });

      const createdUser = await dataSources.userDS.createUser({
        newUser: {
          username: input.username,
          email: input.email,
          hashedPassword,
          phoneNumber: input.phoneNumber,
        },
      });

      if (!createdUser) {
        return {
          success: false,
          __typename: "RegisterFailure",
        };
      }

      return {
        success: true,
        __typename: "RegisterSuccess",
      };
    },
  },
};
