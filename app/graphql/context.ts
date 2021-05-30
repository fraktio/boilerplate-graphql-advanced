import Logger from "bunyan";
import { Request, Response } from "express";

import { Config } from "~/config/config";
import { DataSourcesInContext } from "~/dataSources";
import { DBConnection } from "~/database/connection";
import { createDataLoaders, DataLoaders } from "~/database/dataLoaders";
import { UserTable } from "~/database/user/userQueries";
import { Maybe } from "~/generation/generated";

export type Context = BaseContext & DataSourcesInContext;

export type BaseContext = {
  logger: Logger;
  req: Request;
  res: Response;
  config: Config;
  knex: DBConnection;
  dataLoaders: DataLoaders;
  authenticatedUser: Maybe<UserTable>;
};

type CreateContextParams = { knex: DBConnection; config: Config };

type ApplyMiddlewareApp = { req: Request; res: Response };

export const createContext =
  (params: CreateContextParams) =>
  (app: ApplyMiddlewareApp): BaseContext => ({
    logger: app.req.logger,
    req: app.req,
    res: app.res,
    config: params.config,
    knex: params.knex,
    dataLoaders: createDataLoaders(),
    authenticatedUser: app.req.user || null,
  });
