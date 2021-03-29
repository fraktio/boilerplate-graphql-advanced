import { Config } from "~/config";
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
    host: "localhost",
    user: "graphql-boilerplate-test",
    port: 54321,
    password: "graphql-boilerplate-test",
    databaseName: "graphql-boilerplate-test",
  },
  numberFact: {
    token: "numberfactToken",
  },
};

// Change `stdoutLogging` if you want logging when running tests
export const createTestServer = () => createServer({ config });
