import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { Config } from "~/config";

export const createExpress = (opts: { config: Config }) => {
  const app = express();

  app.use(cors({ origin: opts.config.apiCorsEndpoint, credentials: true }));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));

  return app;
};
