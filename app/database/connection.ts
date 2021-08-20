import knex, { Knex } from "knex";

import { DatabaseConfig } from "~/config/databaseConfig";
import { Logger } from "~/logger";
import { toSuccess, toFailure, Try } from "~/utils/validation";

export type Transaction = Knex.Transaction;
export type DBSession = Knex | Transaction;

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

    return toFailure(error);
  }
};

type ConnectionParams = {
  databaseConfig: DatabaseConfig;
  logger?: Logger;
};

const createConnection = (
  params: ConnectionParams,
): Knex.StaticConnectionConfig => {
  // eslint-disable-next-line no-process-env
  const googleCloudConnectionName = process.env.CLOUD_SQL_CONNECTION_NAME;

  if (googleCloudConnectionName) {
    const host = params.databaseConfig.host ?? "/cloudsql";
    const fullHost = `${host}/${googleCloudConnectionName}`;

    params.logger?.info(
      { databaseHost: fullHost },
      "Database connection: Google Cloud Platform",
    );

    return {
      host: fullHost,
      user: params.databaseConfig.user,
      password: params.databaseConfig.password,
      database: params.databaseConfig.databaseName,
    };
  }

  params.logger?.info(
    { databaseHost: params.databaseConfig.host },
    "Database connection: Local",
  );

  return {
    host: params.databaseConfig.host,
    user: params.databaseConfig.user,
    port: params.databaseConfig.port,
    password: params.databaseConfig.password,
    database: params.databaseConfig.databaseName,
  };
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
