import { RequestHandler } from "express";

import { Config } from "~/config";
import { UserDataSource } from "~/dataSources/UserDataSource";
import { SessionService } from "~/services/sessionService";

export const sessionHandler = (opts: {
  config: Config;
  sessionService: SessionService;
  userDataSource: UserDataSource;
  // eslint-disable-next-line max-statements, complexity
}): RequestHandler => (req, _, next) => {
  const token = opts.sessionService.getRefreshToken({ req });

  if (!token) {
    return next();
  }

  const jwtPayload = opts.sessionService.verifyRefreshPayload({ token });

  if (!jwtPayload) {
    return next();
  }

  // eslint-disable-next-line no-param-reassign
  req.user = { uuid: jwtPayload.uuid };

  next();
};
