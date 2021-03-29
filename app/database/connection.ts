import knex, { Knex } from "knex";

import { DatabaseConfig } from "~/config";

export type DBConnection = Knex;

export const createKnex = (params: {
  databaseConfig: DatabaseConfig;
}): DBConnection => knex(getConnection(params));

export const getConnection = (params: { databaseConfig: DatabaseConfig }) => ({
  client: params.databaseConfig.type,
  connection: {
    host: params.databaseConfig.host,
    user: params.databaseConfig.user,
    port: params.databaseConfig.port,
    password: params.databaseConfig.password,
    database: params.databaseConfig.databaseName,
  },
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
  useNullAsDefault: true,
});
