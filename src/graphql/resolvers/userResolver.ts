import { AuthenticationError } from "apollo-server-express";

import { Resolvers } from "~/generated/graphql";

export const userResolver: Resolvers = {
  Query: {
    async authenticatedUser(_, __, { authenticatedUser, dataSources }) {
      if (!authenticatedUser) {
        throw new AuthenticationError("Unauthorized");
      }

      const user = await dataSources.userDS.getUser({
        uuid: authenticatedUser.uuid,
      });

      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      return user;
    },
  },
};
