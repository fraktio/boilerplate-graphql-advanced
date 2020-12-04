import { Config } from "./src/config";

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
