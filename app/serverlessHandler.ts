import serverless, { Handler } from "serverless-http";

import { createConfig } from "~/config/config";
import { createServer } from "~/server";

// File has to be at the root level of the api

export const graphqlHandler: Handler = async (event, context) => {
  const config = createConfig();
  const { app, startServer } = await createServer({ config });
  await startServer();
  const handler = serverless(app);

  return await handler(event, context);
};
