import knex from "knex";
import type Knex from "knex";

import { getConnection } from "../../dbConfig";

import { Config } from "~/config";

export const createKnex = (opts: { config: Config }) =>
  knex(getConnection({ config: opts.config }));

export const testConnection = async (opts: { knex: Knex }) => {
  await opts.knex.raw("SELECT 1 + 1 as result;");
};
