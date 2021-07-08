import { Request, Response } from "express";

import { Config } from "~/config/config";
import { DataSourcesInContext } from "~/dataSources";
import { DBSession } from "~/database/connection";
import { createDataLoaders, DataLoaders } from "~/database/dataLoaders";
import { UserTable } from "~/database/user/userQueries";
import { Maybe } from "~/generation/generated";
import { Logger } from "~/logger";

export type Context = BaseContext & DataSourcesInContext;

export type BaseContext = {
  logger: Logger;
  req: Request;
  res: Response;
  config: Config;
  knex: DBSession;
  dataLoaders: DataLoaders;
  authenticatedUser: Maybe<UserTable>;
  requestId: string;
  startTime: number;
};

type CreateContextParams = { knex: DBSession; config: Config };

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
    requestId: app.req.requestId,
    startTime: Date.now(),
  });
