import { Router } from "express";

import { DBSession } from "~/database/connection";
import { createHealthRoutes } from "~/express/routes/health";
import { createVersionRoutes } from "~/express/routes/version";

export const createRoutes = (params: { knex: DBSession }): Router => {
  const router = Router();

  router.use("/version", createVersionRoutes());
  router.use("/health", createHealthRoutes(params));

  return router;
};
