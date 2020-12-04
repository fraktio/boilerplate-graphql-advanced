import Logger from "bunyan";
import { Request, Response } from "express";

import { DataSources } from "~/dataSources/dataSources";
import { JWTRefreshPayload } from "~/utils/sessionUtils";
import { Utils } from "~/utils/utils";

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
} & Utils;

export const createContext = (opts: { utils: Utils }) => (app: {
  req: Request;
  res: Response;
}): CreatedContext => ({
  logger: app.req.logger,
  req: app.req,
  res: app.res,
  authenticatedUser: app.req.user || null,
  ...opts.utils,
});
