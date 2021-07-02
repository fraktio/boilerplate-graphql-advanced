import * as variables from "~/config/variablesConfig";

const variablesToCompare = {
  ACCESS_TOKEN_AGE_SECONDS: "ACCESS_TOKEN_AGE_SECONDS",
  API_CORS_ENDPOINT: "API_CORS_ENDPOINT",
  API_PORT: "API_PORT",
  DATABASE_DATABASE_NAME: "DATABASE_DATABASE_NAME",
  DATABASE_HOST: "DATABASE_HOST",
  DATABASE_PASSWORD: "DATABASE_PASSWORD",
  DATABASE_PORT: "DATABASE_PORT",
  DATABASE_TYPE: "DATABASE_TYPE",
  DATABASE_USER: "DATABASE_USER",
  NUMBER_API_MOCK_TOKEN: "NUMBER_API_MOCK_TOKEN",
  PRODUCTION: "PRODUCTION",
  REFRESH_TOKEN_AGE_SECONDS: "REFRESH_TOKEN_AGE_SECONDS",
  STDOUT_LOGGING: "STDOUT_LOGGING",
  TOKEN_DOMAIN: "TOKEN_DOMAIN",
  TOKEN_PATH: "TOKEN_PATH",
  TOKEN_SECRET: "TOKEN_SECRET",
};

describe("config tests / variablesConfig", () => {
  it("variables", async () => {
    expect(variables).toEqual(variablesToCompare);
  });
});
