import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
// import helmet from "helmet";

import { Config } from "~/config";

export const createExpress = (opts: { config: Config }) => {
  const app = express();

  // app.use(helmet({ referrerPolicy: { policy: "no-referrer" } }));
  app.use(cors({ origin: opts.config.apiCorsEndpoint, credentials: true }));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));

  return app;
};
/*
import {
  HealthChecker,
  LivenessEndpoint,
  ReadinessEndpoint,
  HealthEndpoint,
} from "@cloudnative/health-connect";

const healthcheck = new HealthChecker();
  const app = express();

  app.use("/live", LivenessEndpoint(healthcheck));
  app.use("/ready", ReadinessEndpoint(healthcheck));
  app.use("/health", HealthEndpoint(healthcheck));

  */
