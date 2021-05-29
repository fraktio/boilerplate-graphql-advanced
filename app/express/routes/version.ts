import { Router } from "express";
import fs from "fs";

const getVersion = (): string | null => {
  try {
    const obj = JSON.parse(fs.readFileSync("package.json", "utf8"));

    return obj.version;
  } catch (e) {
    return null;
  }
};

const version = getVersion();

export const createVersionRoutes = () => {
  const router = Router();

  router.get("/", (_, res) => {
    if (version) {
      return res.status(200).send(version);
    }

    return res.status(500).send("missing version");
  });

  return router;
};
