import knex, { Knex } from "knex";

import { DatabaseConfig } from "~/config/databaseConfig";

export type Transaction = Knex.Transaction;
export type DBSession = Knex | Transaction;

export const createKnex = (params: {
  databaseConfig: DatabaseConfig;
}): DBSession => knex(getConnection(params));

// I'm not perfect add values to me if needed :^)
type KnexConfig = {
  client: string;
  connection: {
    host: string;
    user: string;
    port: number;
    password: string;
    database: string;
  };
  migrations: {
    directory: string;
  };
  seeds: {
    directory: string;
  };
  useNullAsDefault: boolean;
};

export const getConnection = (params: {
  databaseConfig: DatabaseConfig;
}): KnexConfig => ({
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
