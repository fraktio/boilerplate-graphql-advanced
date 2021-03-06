import { RequestHandler } from "express";

import { CookiesConfig } from "~/config";
import { DBConnection } from "~/database/connection";
import { personDB } from "~/database/person/personDatabase";
import { sessionUtils } from "~/utils/sessionUtils";

export const sessionHandler = (params: {
  knex: DBConnection;
  cookiesConfig: CookiesConfig;
}): RequestHandler => async (req, _, next) => {
  const token = sessionUtils.getRefreshToken({ req });

  if (!token) {
    return next();
  }

  const jwtPayload = sessionUtils.verifyRefreshPayload({
    token,
    tokenSecret: params.cookiesConfig.secret,
  });

  if (!jwtPayload) {
    return next();
  }

  const user = await personDB.getByUUID({
    knex: params.knex,
    personUUID: jwtPayload.uuid,
  });

  if (user) {
    // eslint-disable-next-line no-param-reassign
    req.user = user;
  }

  next();
};
