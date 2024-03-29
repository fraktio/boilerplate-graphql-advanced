import { Router } from "express";

import { DBSession } from "~/database/connection";

export const createHealthRoutes = (params: { knex: DBSession }): Router => {
  const router = Router();

  router.get("/", async (_, res) => {
    try {
      await params.knex.raw("select 1+1 as result");
      res.status(200).send("OK");
    } catch (e) {
      res.status(500).send("Server not live");
    }
  });

  return router;
};
