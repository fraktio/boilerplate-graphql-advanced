import * as variables from "~/config/envNames";

const variablesToCompare = {
  ACCESS_TOKEN_AGE_SECONDS: "ACCESS_TOKEN_AGE_SECONDS",
  API_CORS_ENDPOINT: "API_CORS_ENDPOINT",
  API_EXPOSE_ERRORS: "API_EXPOSE_ERRORS",
  API_NUMBER_FACT_TOKEN: "API_NUMBER_FACT_TOKEN",
  API_PORT: "API_PORT",
  DATABASE_HOST: "DATABASE_HOST",
  DATABASE_NAME: "DATABASE_NAME",
  DATABASE_PASSWORD: "DATABASE_PASSWORD",
  DATABASE_PORT: "DATABASE_PORT",
  DATABASE_TYPE: "DATABASE_TYPE",
  DATABASE_USER: "DATABASE_USER",
  GOOGLE_CLOUD_PROJECT_ID: "GOOGLE_CLOUD_PROJECT_ID",
  GOOGLE_CLOUD_SQL_CONNECTION_NAME: "GOOGLE_CLOUD_SQL_CONNECTION_NAME",
  GRAPHQL_ALLOW_INTROSPECTION: "GRAPHQL_ALLOW_INTROSPECTION",
  GRAPHQL_INLINE_TRACE: "GRAPHQL_INLINE_TRACE",
  IS_PRODUCTION: "IS_PRODUCTION",
  IS_REDIS_USED: "IS_REDIS_USED",
  LOGGING_LEVEL: "LOGGING_LEVEL",
  PLATFORM: "PLATFORM",
  REDIS_HOST: "REDIS_HOST",
  REDIS_PASSWORD: "REDIS_PASSWORD",
  REDIS_PORT: "REDIS_PORT",
  REDIS_USERNAME: "REDIS_USERNAME",
  REFRESH_TOKEN_AGE_SECONDS: "REFRESH_TOKEN_AGE_SECONDS",
  TOKEN_DOMAIN: "TOKEN_DOMAIN",
  TOKEN_PATH: "TOKEN_PATH",
  TOKEN_SECRET: "TOKEN_SECRET",
};

describe("config tests / variablesConfig", () => {
  it("variables", async () => {
    expect(variables).toEqual(variablesToCompare);
  });
});
