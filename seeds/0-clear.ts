import * as Knex from "knex";

import { Table } from "../src/database/types";

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Table.MOVIE_GENRE_RELATION).del();
  await knex(Table.CAST).del();
  await knex(Table.USERS).del();
  await knex(Table.GENRES).del();
  await knex(Table.MOVIES).del();
  await knex(Table.PERSONS).del();
};
