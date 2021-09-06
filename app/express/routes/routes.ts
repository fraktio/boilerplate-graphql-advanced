import { Router } from "express";

import { LoggingConfig } from "~/config/configs/loggingConfig";
import { DBSession } from "~/database/connection";
import { createHealthRoutes } from "~/express/routes/health";
import { createVersionRoutes } from "~/express/routes/version";

export const createRoutes = (params: {
  knex: DBSession;
  loggingConfig: LoggingConfig;
}): Router => {
  const router = Router();

  router.use(
    "/version",
    createVersionRoutes({ loggingConfig: params.loggingConfig }),
  );
  router.use("/health", createHealthRoutes({ knex: params.knex }));

  return router;
};
