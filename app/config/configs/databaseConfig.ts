import {
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
} from "~/config/envNames";
import { getEnv, getEnvInt } from "~/config/getters";

const allowedDatabaseTypes = ["pg" as const];

type DatabaseType = typeof allowedDatabaseTypes[number];

export type DatabaseConfig = {
  type: DatabaseType;
  host: string;
  user: string;
  port: number;
  password: string;
  databaseName: string;
};

export const createDatabaseConfig = (): DatabaseConfig => ({
  type: getEnv(DATABASE_TYPE, allowedDatabaseTypes),
  host: getEnv(DATABASE_HOST),
  user: getEnv(DATABASE_USER),
  port: getEnvInt(DATABASE_PORT),
  password: getEnv(DATABASE_PASSWORD),
  databaseName: getEnv(DATABASE_NAME),
});
