/* eslint-disable no-process-env */
import { isRight } from "fp-ts/lib/Either";
import * as t from "io-ts";
import reporter from "io-ts-reporters";

import { CookiesConfigDecoder } from "./cookiesConfig";
import { DatabaseConfigDecoder } from "./databaseConfig";
import { EnvConfigDecoder } from "./envConfig";
import { NumberFactConfigDecoder } from "./numberFactConfig";

export const API_PORT = "API_PORT";
export const STDOUT_LOGGING = "STDOUT_LOGGING";
export const PRODUCTION = "PRODUCTION";
export const API_CORS_ENDPOINT = "API_CORS_ENDPOINT";
export const TOKEN_PATH = "TOKEN_PATH";
export const TOKEN_DOMAIN = "TOKEN_DOMAIN";
export const TOKEN_SECRET = "TOKEN_SECRET";
export const ACCESS_TOKEN_AGE_SECONDS = "ACCESS_TOKEN_AGE_SECONDS";
export const REFRESH_TOKEN_AGE_SECONDS = "REFRESH_TOKEN_AGE_SECONDS";
export const DATABASE_TYPE = "DATABASE_TYPE";
export const DATABASE_HOST = "DATABASE_HOST";
export const DATABASE_USER = "DATABASE_USER";
export const DATABASE_PORT = "DATABASE_PORT";
export const DATABASE_PASSWORD = "DATABASE_PASSWORD";
export const DATABASE_DATABASE_NAME = "DATABASE_DATABASE_NAME";
export const NUMBER_API_MOCK_TOKEN = "NUMBER_API_MOCK_TOKEN";

export const getEnv = (env: string): string | undefined =>
  process.env[env] || undefined; // prevent empty strings

export const ConfigDecoder = t.type({
  env: EnvConfigDecoder,
  cookies: CookiesConfigDecoder,
  database: DatabaseConfigDecoder,
  numberFact: NumberFactConfigDecoder,
});

export type Config = t.TypeOf<typeof ConfigDecoder>;

export const validateConfig = (config: unknown) => {
  const validated = ConfigDecoder.decode(config);

  if (!isRight(validated)) {
    const errors = reporter.report(validated);
    const message = `\n ${errors.join(
      "\n",
    )} \n\n Invalid environmental configation`;
    throw new Error(message);
  }

  return validated.right;
};

export const createConfig = () => {
  const config = {
    env: {
      apiPort: getEnv(API_PORT),
      stdoutLogging: getEnv(STDOUT_LOGGING),
      isProduction: getEnv(PRODUCTION),
      apiCorsEndpoint: getEnv(API_CORS_ENDPOINT),
    },

    cookies: {
      path: getEnv(TOKEN_PATH),
      domain: getEnv(TOKEN_DOMAIN),
      secret: getEnv(TOKEN_SECRET),
      accessAgeSeconds: getEnv(ACCESS_TOKEN_AGE_SECONDS),
      refreshAgeSeconds: getEnv(REFRESH_TOKEN_AGE_SECONDS),
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
