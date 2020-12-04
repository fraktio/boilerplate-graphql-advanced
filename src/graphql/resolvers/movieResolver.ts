import { UserInputError } from "apollo-server-express";

import { Resolvers } from "~/generated/graphql";

export const movieResolver: Resolvers = {
  Movie: {
    async genres(movie, _, { dataSources }) {
      return await dataSources.genreDS.getGenresOfMovie({
        uuid: movie.uuid,
      });
    },

    async cast(movie, _, { dataSources }) {
      return await dataSources.personDS.getPersonsOfMovie({
        uuid: movie.uuid,
      });
    },
  },

  Query: {
    async movie(_, { input }, { dataSources }) {
      const movie = await dataSources.movieDS.getMovie({ uuid: input.uuid });

      if (!movie) {
        throw new UserInputError("Invalid movie uuid");
      }

      return movie;
    },

    async movies(_, __, { dataSources }) {
      return await dataSources.movieDS.getMovies();
    },
  },
};
