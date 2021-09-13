import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";

import { Config } from "~/config/config";
import { DBSession } from "~/database/connection";

export const createExpress = (opts: {
  config: Config;
  knex: DBSession;
}): Express => {
  const app = express();

  const helmetMiddleware = helmet({ contentSecurityPolicy: false });

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
