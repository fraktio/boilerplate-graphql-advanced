import { Router } from "express";

export const createHeadersRoutes = (): Router => {
  const router = Router();

  router.get("/", async (req, res) => res.status(200).json(req.headers));

  return router;
};
