import * as Knex from "knex";

import { CastTableRaw } from "../src/dataSources/CastDataSource";
import { MovieTableRaw } from "../src/dataSources/MovieDataSource";
import { PersonTableRaw } from "../src/dataSources/PersonDataSource";
import { Table } from "../src/database/types";

import { seedMovies } from "./seedData";

export async function seed(knex: Knex): Promise<void> {
  for (const seedMovie of Object.values(seedMovies)) {
    const movie = await knex<MovieTableRaw>(Table.MOVIES)
      .where({ title: seedMovie.title })
      .first();

    if (!movie) {
      continue;
    }

    for (const seedPerson of seedMovie.cast) {
      const person = await knex<PersonTableRaw>(Table.PERSONS)
        .where({
          firstName: seedPerson.firstName,
          familyName: seedPerson.familyName,
        })
        .first();

      if (!person) {
        continue;
      }

      await knex<CastTableRaw>(Table.CAST).insert({
        movieId: movie.id,
        personId: person.id,
      });
    }
  }
}
