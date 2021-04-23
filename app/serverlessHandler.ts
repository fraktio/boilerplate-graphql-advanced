import serverless, { Handler } from "serverless-http";

import { createServerlessConfig } from "~/config/serverlessConfig";
import { createServer } from "~/server";

// File has to be at the root level of the api

export const graphqlHandler: Handler = async (event, context) => {
  const config = await createServerlessConfig();
  const { app } = createServer({ config });
  const handler = serverless(app);

  return await handler(event, context);
};
