/* eslint-disable no-process-env */
import { isLeft } from "fp-ts/lib/Either";
import * as t from "io-ts";
import reporter from "io-ts-reporters";

import { CookiesConfigDecoder } from "~/config/cookiesConfig";
import { DatabaseConfigDecoder } from "~/config/databaseConfig";
import { EnvConfigDecoder } from "~/config/envConfig";
import {
  getPackageName,
  getPackageVersion,
  LoggingConfigDecoder,
} from "~/config/loggingConfig";
import { NumberFactConfigDecoder } from "~/config/numberFactConfig";
import {
  ACCESS_TOKEN_AGE_SECONDS,
  API_CORS_ENDPOINT,
  API_PORT,
  NUMBER_API_MOCK_TOKEN,
  PRODUCTION,
  TOKEN_DOMAIN,
  TOKEN_PATH,
  TOKEN_SECRET,
  DATABASE_DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
  LOGGING_LEVEL,
} from "~/config/variablesConfig";

export const getEnv = (env: string): string | undefined =>
  // eslint-disable-next-line no-process-env
  process.env[env] || undefined; // prevent empty strings

export const ConfigDecoder = t.interface(
  {
    logging: LoggingConfigDecoder,
    env: EnvConfigDecoder,
    cookies: CookiesConfigDecoder,
    database: DatabaseConfigDecoder,
    numberFact: NumberFactConfigDecoder,
  },
  "configDecoder",
);

export type Config = t.TypeOf<typeof ConfigDecoder>;

export const validateConfig = (config: unknown): Config => {
  const validated = ConfigDecoder.decode(config);

  if (isLeft(validated)) {
    const errors = reporter.report(validated);
    const message = `\n ${errors.join(
      "\n",
    )} \n\n Invalid environmental configation`;

    console.error(message);
    process.exit();
  }

  return validated.right;
};

type ObjectKeys<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: ObjectKeys<T[K]>;
    }
  : unknown;

export type ConfigStructure = ObjectKeys<Config>;

export const createConfig = (): Config => {
  const config: ConfigStructure = {
    logging: {
      loggingLevel: getEnv(LOGGING_LEVEL)?.toLowerCase(),
      version: getPackageVersion(),
      name: getPackageName(),
    },

    env: {
      apiPort: getEnv(API_PORT),
      isProduction: getEnv(PRODUCTION),
      apiCorsEndpoint: getEnv(API_CORS_ENDPOINT),
    },

    cookies: {
      path: getEnv(TOKEN_PATH),
      domain: getEnv(TOKEN_DOMAIN),
      secret: getEnv(TOKEN_SECRET),
      accessTokenAgeSeconds: getEnv(ACCESS_TOKEN_AGE_SECONDS),
    },

    database: {
      type: getEnv(DATABASE_TYPE),
      host: getEnv(DATABASE_HOST),
      user: getEnv(DATABASE_USER),
      port: getEnv(DATABASE_PORT),
      password: getEnv(DATABASE_PASSWORD),
      databaseName: getEnv(DATABASE_DATABASE_NAME),
    },

    numberFact: {
      token: getEnv(NUMBER_API_MOCK_TOKEN),
    },
  };

  return validateConfig(config);
};
