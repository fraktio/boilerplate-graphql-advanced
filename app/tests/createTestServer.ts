import {
  Config,
  DATABASE_DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  getEnvFallback,
  getEnvIntFallback,
} from "~/config";
import { createServer } from "~/server";

const config: Config = {
  apiPort: 4001,
  stdoutLogging: false,
  isProduction: true,
  apiCorsEndpoint: "*",
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

// Change `stdoutLogging` if you want logging when running tests
export const createTestServer = () => createServer({ config });
