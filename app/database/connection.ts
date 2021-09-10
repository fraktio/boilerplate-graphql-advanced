import knex, { Knex } from "knex";

import { DatabaseConfig } from "~/config/configs/databaseConfig";
import {
  Platform,
  PlatformConfig,
  PlatformGoogleCloudConfig,
  PlatformLocalConfig,
} from "~/config/configs/platformConfig";
import { Logger } from "~/logger";
import { toFailure, toSuccess, Try } from "~/utils/validation";

export type Transaction = Knex.Transaction;
export type DBSession = Knex | Transaction;

export const testDbConnection = async (params: {
  dbConnection: DBSession;
}): Promise<Try<true, Error>> => {
  try {
    await params.dbConnection.raw("select 1+1 as result");

    return toSuccess(true);
  } catch (error) {
    return toFailure(error as Error);
  }
};

export const withTransaction = async <T>(
  params: { knex: DBSession; logger: Logger },
  asyncCallback: (cParams: { transaction: Transaction }) => Promise<T>,
): Promise<Try<T, Error>> => {
  const transaction = await params.knex.transaction();

  try {
    const result = await asyncCallback({ transaction });
    await transaction.commit();

    return toSuccess(result);
  } catch (error) {
    await transaction.rollback();
    params.logger.fatal(error, "Transaction error");

    return toFailure(error as Error);
  }
};

type ConnectionParams<T extends PlatformConfig = PlatformConfig> = {
  platformConfig: T;
  databaseConfig: DatabaseConfig;
  logger?: Logger;
};

const createConnectionLocal = (
  params: ConnectionParams<PlatformLocalConfig>,
): Knex.StaticConnectionConfig => {
  params.logger?.info({
    databaseHost: params.databaseConfig.host,
    platform: params.platformConfig.type,
  });

  return {
    host: params.databaseConfig.host,
    user: params.databaseConfig.user,
    port: params.databaseConfig.port,
    password: params.databaseConfig.password,
    database: params.databaseConfig.databaseName,
  };
};

const createConnectionGoogleCloudPlatform = (
  params: ConnectionParams<PlatformGoogleCloudConfig>,
): Knex.StaticConnectionConfig => {
  const fullHost = `${params.databaseConfig.host}/${params.platformConfig.sqlConnectionName}`;

  params.logger?.info({
    databaseHost: fullHost,
    platform: params.platformConfig.type,
  });

  return {
    host: fullHost,
    user: params.databaseConfig.user,
    port: params.databaseConfig.port,
    password: params.databaseConfig.password,
    database: params.databaseConfig.databaseName,
  };
};

const createConnection = (
  params: ConnectionParams,
): Knex.StaticConnectionConfig => {
  switch (params.platformConfig.type) {
    case Platform.GoogleCloudPlatform:
      return createConnectionGoogleCloudPlatform(
        params as ConnectionParams<PlatformGoogleCloudConfig>,
      );

    case Platform.Local:
    default:
      return createConnectionLocal(
        params as ConnectionParams<PlatformLocalConfig>,
      );
  }
};

export const createKnex = (params: ConnectionParams): DBSession =>
  knex(getConnection(params));

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
