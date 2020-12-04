import { UserInputError } from "apollo-server-express";

import { Resolvers } from "~/generated/graphql";

export const personResolver: Resolvers = {
  Person: {
    async movies(movie, _, { dataSources }) {
      return await dataSources.movieDS.getMoviesOfPerson({
        uuid: movie.uuid,
      });
    },
  },

  Query: {
    async person(_, { input }, { dataSources }) {
      const person = await dataSources.personDS.getPerson({ uuid: input.uuid });

      if (!person) {
        throw new UserInputError("Invalid person uuid");
      }

      return person;
    },

    async persons(_, __, { dataSources }) {
      return await dataSources.personDS.getPersons();
    },
  },
};
