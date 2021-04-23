/* eslint-disable no-process-env */

import {
  DATABASE_DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from "../config/variables";

import { Config, validateConfig } from "./config";

export const getEnvFallback = (envKey: string, fallback: string): string => {
  const value = process.env[envKey];

  if (!value) {
    return fallback;
  }

  return value;
};

export const getEnvIntFallback = (envKey: string, fallback: number): number => {
  const value = process.env[envKey];

  if (!value) {
    return fallback;
  }

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    throw new Error(
      `Environment variable ${envKey}. Received invalid value for INT: ${value}`,
    );
  }

  return parsed;
};

// Change `stdoutLogging` if you want logging when running tests
export const createTestConfig = (): Config => {
  const config: Config = {
    env: {
      apiPort: 4001,
      stdoutLogging: false,
      isProduction: true,
      apiCorsEndpoint: "*",
    },
    cookies: {
      path: "/",
      domain: "localhost",
      secret: "cookieSecret",
      accessAgeSeconds: 86400,
      refreshAgeSeconds: 86400,
    },
    database: {
      type: "pg",
      host: getEnvFallback(DATABASE_HOST, "localhost"),
      user: getEnvFallback(DATABASE_USER, "graphql-boilerplate-test"),
      port: getEnvIntFallback(DATABASE_PORT, 54321),
      password: getEnvFallback(DATABASE_PASSWORD, "graphql-boilerplate-test"),
      databaseName: getEnvFallback(
        DATABASE_DATABASE_NAME,
        "graphql-boilerplate-test",
      ),
    },
    numberFact: {
      token: "numberfactToken",
    },
  };

  return validateConfig(config);
};
