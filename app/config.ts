/* eslint-disable no-process-env */

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

export const getEnvFallback = (envKey: string, fallback: string): string => {
  const value = process.env[envKey];

  if (!value) {
    return fallback;
  }

  return value;
};

const requireEnv = (env: string): string => {
  const envVariable = process.env[env];

  if (!envVariable) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  return envVariable;
};

const requireIntEnv = (env: string): number => {
  const value = requireEnv(env);

  const parsed = parseInt(value, 10);

  if (!parsed || isNaN(parsed)) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  return parsed;
};

const requireBoolean = (env: string): boolean => {
  const value = requireEnv(env);

  if (value === "TRUE") {
    return true;
  }

  if (value === "FALSE") {
    return false;
  }

  throw new Error(
    `Environment variable ${env} only accepts 'TRUE' or 'FALSE'!`,
  );
};

export const getCookiesConfigFromEnv = () => ({
  path: requireEnv(TOKEN_PATH),
  domain: requireEnv(TOKEN_DOMAIN),
  secret: requireEnv(TOKEN_SECRET),
  accessAgeSeconds: requireIntEnv(ACCESS_TOKEN_AGE_SECONDS),
  refreshAgeSeconds: requireIntEnv(REFRESH_TOKEN_AGE_SECONDS),
});

export type CookiesConfig = ReturnType<typeof getCookiesConfigFromEnv>;

export const getDatabaseConfigFromEnv = () => ({
  type: requireEnv(DATABASE_TYPE),
  host: requireEnv(DATABASE_HOST),
  user: requireEnv(DATABASE_USER),
  port: requireIntEnv(DATABASE_PORT),
  password: requireEnv(DATABASE_PASSWORD),
  databaseName: requireEnv(DATABASE_DATABASE_NAME),
});

export type DatabaseConfig = ReturnType<typeof getDatabaseConfigFromEnv>;

export const getNumberFactConfigFromEnv = () => ({
  token: requireEnv(NUMBER_API_MOCK_TOKEN),
});

export type NumberFactConfig = ReturnType<typeof getNumberFactConfigFromEnv>;

export const getConfigFromEnv = () => ({
  apiPort: requireIntEnv(API_PORT),
  stdoutLogging: requireBoolean(STDOUT_LOGGING),
  isProduction: requireBoolean(PRODUCTION),
  apiCorsEndpoint: requireEnv(API_CORS_ENDPOINT),

  cookies: getCookiesConfigFromEnv(),
  database: getDatabaseConfigFromEnv(),

  numberFact: getNumberFactConfigFromEnv(),
});

export type Config = ReturnType<typeof getConfigFromEnv>;
