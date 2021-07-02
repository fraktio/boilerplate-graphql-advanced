import { isLeft } from "fp-ts/lib/Either";
import * as t from "io-ts";
import reporter from "io-ts-reporters";

import { getEnv } from "~/config/config";
import {
  DATABASE_DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
} from "~/config/variablesConfig";
import { NumberFromString } from "~/utils/decoders";

export const DatabaseConfigDecoder = t.type({
  type: t.string,
  host: t.string,
  user: t.string,
  port: NumberFromString,
  password: t.string,
  databaseName: t.string,
});

export type DatabaseConfig = t.TypeOf<typeof DatabaseConfigDecoder>;

export const validateDatabaseConfig = (config: unknown): DatabaseConfig => {
  const validated = DatabaseConfigDecoder.decode(config);

  if (isLeft(validated)) {
    const errors = reporter.report(validated);
    console.error(errors.join("\n"));
    throw new Error("Invalid environmental configation");
  }

  return validated.right;
};

export const createDatabaseConfig = (): DatabaseConfig => {
  const dbConfig = {
    type: getEnv(DATABASE_TYPE),
    host: getEnv(DATABASE_HOST),
    user: getEnv(DATABASE_USER),
    port: getEnv(DATABASE_PORT),
    password: getEnv(DATABASE_PASSWORD),
    databaseName: getEnv(DATABASE_DATABASE_NAME),
  };

  return validateDatabaseConfig(dbConfig);
};
