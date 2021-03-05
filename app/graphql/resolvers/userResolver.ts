import { AuthenticationError } from "apollo-server-express";

import { authenticatedUserHandler } from "../handlers/authenticatedUserHandlers";

import { Resolvers } from "~/generated/graphql";

export const userResolver: Resolvers = {
  Query: {
    async authenticatedUser(_, __, { authenticatedUser }) {
      if (!authenticatedUser) {
        throw new AuthenticationError("Unauthorized");
      }

      const user = await authenticatedUserHandler({
        authenticatedUser,
      });

      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      return user;
    },
  },
};
