import { Resolvers } from "~/generated/graphql";

export const pageResolver: Resolvers = {
  Query: {
    page(_, { input }) {
      return { slug: input.slug };
    },
  },
};
