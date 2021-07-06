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

export const createKnex = (params: {
  databaseConfig: DatabaseConfig;
}): DBSession => knex(getConnection(params));

export const getConnection = (params: {
  databaseConfig: DatabaseConfig;
}): Knex.Config => ({
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
