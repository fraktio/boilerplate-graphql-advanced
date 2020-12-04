import Logger from "bunyan";
import { Request, Response } from "express";

import { DataSources } from "~/dataSources/dataSources";
import { Services } from "~/services/services";
import { JWTRefreshPayload } from "~/services/sessionService";

export type Context = CreatedContext & {
  // Do not remove this
  // Apollo injects datasources to context automatically
  dataSources: DataSources;
};

type CreatedContext = {
  logger: Logger;
  req: Request;
  res: Response;
  authenticatedUser: JWTRefreshPayload | null;
} & Services;

export const createContext = (opts: { services: Services }) => (app: {
  req: Request;
  res: Response;
}): CreatedContext => ({
  logger: app.req.logger,
  req: app.req,
  res: app.res,
  authenticatedUser: app.req.user || null,
  ...opts.services,
});
