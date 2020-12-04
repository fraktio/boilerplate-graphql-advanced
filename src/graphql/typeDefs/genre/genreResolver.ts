import { UserInputError } from "apollo-server-express";

import { Resolvers } from "~/generated/graphql";

export const genreResolver: Resolvers = {
  Genre: {
    async movies(genre, _, { dataSources, responseService }) {
      // console.log("genre", genre.uuid);
      const movies = await dataSources.movieDS.getMoviesOfGenre({
        uuid: genre.uuid,
      });

      return movies.map(responseService.formarMovie);
    },
  },

  Query: {
    async genre(_, { input }, { dataSources, responseService }) {
      const genre = await dataSources.genreDS.getGenre({ uuid: input.uuid });

      if (!genre) {
        throw new UserInputError("Invalid genre uuid");
      }

      return responseService.formatGenre(genre);
    },

    async genres(_, __, { dataSources, responseService }) {
      const genres = await dataSources.genreDS.getGenres();

      return genres.map(responseService.formatGenre);
    },
  },
};
