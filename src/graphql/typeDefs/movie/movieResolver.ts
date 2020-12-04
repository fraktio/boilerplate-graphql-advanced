import { UserInputError } from "apollo-server-express";

import { Resolvers } from "~/generated/graphql";

export const movieResolver: Resolvers = {
  Movie: {
    async genres(movie, _, { dataSources, responseService }) {
      const genres = await dataSources.genreDS.getGenresOfMovie({
        uuid: movie.uuid,
      });

      return genres.map(responseService.formatGenre);
    },

    async cast(movie, _, { dataSources, responseService }) {
      const persons = await dataSources.personDS.getPersonsOfMovie({
        uuid: movie.uuid,
      });

      return persons.map(responseService.formatPerson);
    },
  },

  Query: {
    async movie(_, { input }, { dataSources, responseService }) {
      const movie = await dataSources.movieDS.getMovie({ uuid: input.uuid });

      if (!movie) {
        throw new UserInputError("Invalid movie uuid");
      }

      return responseService.formarMovie(movie);
    },

    async movies(_, __, { dataSources, responseService }) {
      const movies = await dataSources.movieDS.getMovies();

      return movies.map(responseService.formarMovie);
    },
  },
};
