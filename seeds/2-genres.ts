import * as Knex from "knex";
import { v4 as uuidv4 } from "uuid";

import { GenresTable } from "../src/dataSources/GenreDataSource";
import { Table } from "../src/database/types";

import { SeedGenre } from "./seedData";

export async function seed(knex: Knex): Promise<void> {
  await knex<GenresTable>(Table.GENRES).insert(
    Object.values(SeedGenre).map((type) => ({ uuid: uuidv4(), type })),
  );
}
