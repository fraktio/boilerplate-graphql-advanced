import serverless, { Handler } from "serverless-http";

import { createServer } from "~/server";
// import { getConfig } from "~/serverlessConfig";

// File has to be at the root level of the api

export const graphqlHandler: Handler = async (event, context) => {
  // const config = await getConfig();
  const config = {
    apiPort: 80,
    stdoutLogging: true,
    isProduction: false,
    apiCorsEndpoint: "*",

    cookies: {
      path: "/",
      domain: "amazon.com",
      secret: "abc123",
      accessAgeSeconds: 1000000,
      refreshAgeSeconds: 1000000,
    },

    database: {
      type: "pg",
      host: "localhost",
      user: "graphlq-user",
      port: 5432,
      password: "graphlq-user",
      databaseName: "graphlq-user",
    },
    numberFact: {
      token: "token",
    },
  };

  const { app } = createServer({ config });
  const handler = serverless(app);

  return await handler(event, context);
};
