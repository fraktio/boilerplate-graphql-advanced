import Logger from "bunyan";
import { RequestHandler } from "express";

export const loggerHandler =
  (opts: { logger: Logger }): RequestHandler =>
  (req, _, next): void => {
    // eslint-disable-next-line no-param-reassign
    req.logger = opts.logger;
    next();
  };
