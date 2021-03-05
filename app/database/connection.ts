import knex from "knex";
import type Knex from "knex";

import { Config } from "~/config";

export type DBConnection = Knex;

export const createKnex = (opts: { config: Config }) =>
  knex(getConnection({ config: opts.config }));

export const testConnection = async (opts: { knex: Knex }) => {
  await opts.knex.raw("SELECT 1 + 1 as result;");
};

export const getConnection = (opts: { config: Config }) => ({
  client: opts.config.database.type,
  connection: {
    host: opts.config.database.host,
    user: opts.config.database.user,
    port: opts.config.database.port,
    password: opts.config.database.password,
    database: opts.config.database.databaseName,
  },
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
  useNullAsDefault: true,
});
