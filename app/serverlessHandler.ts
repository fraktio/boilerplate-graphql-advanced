import serverless, { Handler } from "serverless-http";

import { createServer } from "~/server";
import { getConfig } from "~/serverlessConfig";

// File has to be at the root level of the api

export const graphqlHandler: Handler = async (event, context) => {
  const config = await getConfig();

  const { app } = createServer({ config });
  const handler = serverless(app);

  return await handler(event, context);
};
