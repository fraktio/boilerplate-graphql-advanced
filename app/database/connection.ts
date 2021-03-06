import knex, { Knex } from "knex";

import { Config } from "~/config";

export type DBConnection = Knex;

export const createKnex = (opts: { config: Config }) =>
  knex(getConnection({ config: opts.config }));

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
