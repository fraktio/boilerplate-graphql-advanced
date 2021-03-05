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
  client: opts.config.databaseType,
  connection: {
    host: opts.config.databaseHost,
    user: opts.config.databaseUser,
    port: opts.config.databasePort,
    password: opts.config.databasePassword,
    database: opts.config.databaseDatabaseName,
  },
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
  useNullAsDefault: true,
});
