import { Router } from "express";

import { LoggingConfig } from "~/config/configs/loggingConfig";

export const createVersionRoutes = (params: {
  loggingConfig: LoggingConfig;
}): Router => {
  const router = Router();

  router.get("/", (_, res) =>
    res.status(200).send(params.loggingConfig.version),
  );

  return router;
};
