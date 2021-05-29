import { Router } from "express";

import { DBConnection } from "~/database/connection";
import { createHealthRoutes } from "~/express/routes/health";
import { createVersionRoutes } from "~/express/routes/version";

export const createRoutes = (params: { knex: DBConnection }) => {
  const router = Router();

  router.use("/version", createVersionRoutes());
  router.use("/health", createHealthRoutes(params));

  return router;
};
