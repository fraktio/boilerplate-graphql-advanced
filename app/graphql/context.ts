import Logger from "bunyan";
import { Request, Response } from "express";

import { Config } from "~/config";
import { createDataLoaders, DataLoaders } from "~/dataLoaders/dataLoaders";
import { DBConnection } from "~/database/connection";
import { UserTable } from "~/database/userDB";
import { Maybe } from "~/generated/graphql";

export type Context = {
  logger: Logger;
  req: Request;
  res: Response;
  config: Config;
  knex: DBConnection;
  dataLoaders: DataLoaders;
  authenticatedUser: Maybe<UserTable>;
};

export const createContext = (params: {
  knex: DBConnection;
  config: Config;
}) => (app: { req: Request; res: Response }) => ({
  logger: app.req.logger,
  req: app.req,
  res: app.res,
  config: params.config,
  knex: params.knex,
  dataLoaders: createDataLoaders(),
  authenticatedUser: app.req.user || null,
});
