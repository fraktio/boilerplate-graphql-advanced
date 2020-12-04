import { UserInputError } from "apollo-server-express";

import { Resolvers } from "~/generated/graphql";

export const personResolver: Resolvers = {
  Person: {
    async movies(movie, _, { dataSources, responseService }) {
      const movies = await dataSources.movieDS.getMoviesOfPerson({
        uuid: movie.uuid,
      });

      return movies.map(responseService.formarMovie);
    },
  },

  Query: {
    async person(_, { input }, { dataSources, responseService }) {
      const person = await dataSources.personDS.getPerson({ uuid: input.uuid });

      if (!person) {
        throw new UserInputError("Invalid person uuid");
      }

      return responseService.formatPerson(person);
    },

    async persons(_, __, { dataSources, responseService }) {
      const persons = await dataSources.personDS.getPersons();

      return persons.map(responseService.formatPerson);
    },
  },
};
