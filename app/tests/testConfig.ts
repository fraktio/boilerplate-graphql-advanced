import { Config } from "~/config/config";
import { LoggingLevel } from "~/config/configs/loggingConfig";
import { Platform } from "~/config/configs/platformConfig";
import {
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from "~/config/envNames";
import { getEnvFallback, getEnvIntFallback } from "~/config/getters";

export const createTestConfig = (): Config => ({
  api: {
    numberFact: {
      token: "token",
    },
  },
  graphql: {
    allowIntrospection: true,
    allowInlineTrace: true,
  },
  redis: {
    useRedis: false,
  },
  database: {
    type: "pg",
    host: getEnvFallback(DATABASE_HOST, "localhost"),
    user: getEnvFallback(DATABASE_USER, "graphql-boilerplate-test"),
    port: getEnvIntFallback(DATABASE_PORT, 54321),
    password: getEnvFallback(DATABASE_PASSWORD, "graphql-boilerplate-test"),
    databaseName: getEnvFallback(DATABASE_NAME, "graphql-boilerplate-test"),
  },
  env: {
    apiPort: 4001,
    isProduction: false,
    apiCorsEndpoint: "*",
  },
  logging: {
    loggingLevel: LoggingLevel.fatal,
    version: "test-version",
    name: "test-api",
  },
  platform: {
    type: Platform.Local,
  },
  session: {
    path: "/",
    domain: "localhost",
    secret: "cookieSecret",
    accessTokenAgeSeconds: 302400,
    refreshTokenAgeSeconds: 604800,
  },
});
