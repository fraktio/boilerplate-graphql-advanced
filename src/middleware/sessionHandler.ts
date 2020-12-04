import { RequestHandler } from "express";

import { Config } from "~/config";
import { UserDataSource } from "~/dataSources/UserDataSource";
import { SessionUtils } from "~/utils/sessionUtils";

export const sessionHandler = (opts: {
  config: Config;
  sessionUtils: SessionUtils;
  userDataSource: UserDataSource;
  // eslint-disable-next-line max-statements, complexity
}): RequestHandler => (req, _, next) => {
  const token = opts.sessionUtils.getRefreshToken({ req });

  if (!token) {
    return next();
  }

  const jwtPayload = opts.sessionUtils.verifyRefreshPayload({ token });

  if (!jwtPayload) {
    return next();
  }

  // eslint-disable-next-line no-param-reassign
  req.user = { uuid: jwtPayload.uuid };

  next();
};
