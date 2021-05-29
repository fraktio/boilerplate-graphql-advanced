import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";

import { Config } from "~/config/config";
import { DBConnection } from "~/database/connection";

export const createExpress = (opts: {
  config: Config;
  knex: DBConnection;
}): Express => {
  const app = express();

  // https://github.com/helmetjs/helmet
  const helmetMiddleware = helmet(
    opts.config.env.isProduction ? undefined : { contentSecurityPolicy: false },
  );

  app.use(helmetMiddleware);
  app.use(cors({ origin: opts.config.env.apiCorsEndpoint, credentials: true }));
  app.use(cookieParser());
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "20mb",
      parameterLimit: 20,
    }),
  );

  return app;
};
