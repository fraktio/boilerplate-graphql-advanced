import * as Knex from "knex";
import { v4 as uuidv4 } from "uuid";

import { MovieTableRaw } from "../src/dataSources/MovieDataSource";
import { Table } from "../src/database/types";

import { seedMovies } from "./seedData";

export async function seed(knex: Knex): Promise<void> {
  const movies = Object.values(seedMovies).map((seedMovie) => ({
    uuid: uuidv4(),
    title: seedMovie.title,
    rating: seedMovie.rating,
    releaseDate: seedMovie.releaseDate,
  }));

  await knex<MovieTableRaw>(Table.MOVIES).insert(movies);
}
