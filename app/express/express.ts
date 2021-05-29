import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { Config } from "~/config/config";
import { DBConnection } from "~/database/connection";

const getHelmetOptions = (params: { isProduction: boolean }) => {
  if (params.isProduction) {
    return undefined;
  }

  return {
    contentSecurityPolicy: false as const,
  };
};

export const createExpress = (opts: { config: Config; knex: DBConnection }) => {
  const app = express();

  // https://github.com/helmetjs/helmet
  app.use(
    helmet(getHelmetOptions({ isProduction: opts.config.env.isProduction })),
  );

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
