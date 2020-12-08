import Logger from "bunyan";
import { Request, Response } from "express";
import Knex from "knex";

import { createDataLoaders, DataLoaders } from "~/dataLoaders/dataLoaders";
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
  dataLoaders: DataLoaders;
} & Utils;

export const createContext = (opts: { utils: Utils; knex: Knex }) => (app: {
  req: Request;
  res: Response;
}): CreatedContext => ({
  logger: app.req.logger,
  req: app.req,
  res: app.res,
  dataLoaders: createDataLoaders({ knex: opts.knex }),
  authenticatedUser: app.req.user || null,
  ...opts.utils,
});
