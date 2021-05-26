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
  // eslint-disable-next-line no-process-env
  process.env[env] || undefined; // prevent empty strings