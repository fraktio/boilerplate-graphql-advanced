import knex, { Knex } from "knex";

import { DatabaseConfig } from "~/config/databaseConfig";
import { Logger } from "~/logger";

export type DBConnection = Knex;

type ConnectionParams = {
  databaseConfig: DatabaseConfig;
  logger?: Logger;
};

export const createKnex = (params: ConnectionParams): DBConnection =>
  knex(getConnection(params));

const createConnection = (
  params: ConnectionParams,
): Knex.StaticConnectionConfig => {
  // eslint-disable-next-line no-process-env
  const googleCloudConnectionName = process.env.CLOUD_SQL_CONNECTION_NAME;

  if (googleCloudConnectionName) {
    const host = params.databaseConfig.host ?? "/cloudsql";
    const fullHost = `${host}/${googleCloudConnectionName}`;

    params.logger?.info("Using google cloud connection", { host: fullHost });

    return {
      host: fullHost,
      user: params.databaseConfig.user,
      password: params.databaseConfig.password,
      database: params.databaseConfig.databaseName,
    };
  }

  params.logger?.info("Using default connection", {
    host: params.databaseConfig.host,
  });

  return {
    host: params.databaseConfig.host,
    user: params.databaseConfig.user,
    port: params.databaseConfig.port,
    password: params.databaseConfig.password,
    database: params.databaseConfig.databaseName,
  };
};

export const getConnection = (params: ConnectionParams): Knex.Config => ({
  client: params.databaseConfig.type,
  connection: createConnection(params),
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
  useNullAsDefault: true,
});
