import * as Knex from "knex";

import { GenresTableRaw } from "../src/dataSources/GenreDataSource";
import {
  MovieGenreRelationTableRaw,
  MovieTableRaw,
  Table,
} from "../src/database/types";

import { seedMovies } from "./seedData";

export async function seed(knex: Knex): Promise<void> {
  for (const seedMovie of Object.values(seedMovies)) {
    const movie = await knex<MovieTableRaw>(Table.MOVIES)
      .where({ title: seedMovie.title })
      .first();

    if (!movie) {
      continue;
    }

    for (const seedGenre of seedMovie.genres) {
      const genre = await knex<GenresTableRaw>(Table.GENRES)
        .where({ type: seedGenre })
        .first();

      if (!genre) {
        continue;
      }

      await knex<MovieGenreRelationTableRaw>(Table.MOVIE_GENRE_RELATION).insert(
        {
          movieId: movie.id,
          genreId: genre.id,
        },
      );
    }
  }
}
