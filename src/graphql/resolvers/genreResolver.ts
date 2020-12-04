import { UserInputError } from "apollo-server-express";

import { Resolvers } from "~/generated/graphql";

export const genreResolver: Resolvers = {
  Genre: {
    async movies(genre, _, { dataSources }) {
      return await dataSources.movieDS.getMoviesOfGenre({
        uuid: genre.uuid,
      });
    },
  },

  Query: {
    async genre(_, { input }, { dataSources }) {
      const genre = await dataSources.genreDS.getGenre({ uuid: input.uuid });

      if (!genre) {
        throw new UserInputError("Invalid genre uuid");
      }

      return genre;
    },

    async genres(_, __, { dataSources }) {
      return await dataSources.genreDS.getGenres();
    },
  },
};
