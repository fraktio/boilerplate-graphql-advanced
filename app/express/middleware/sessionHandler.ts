import { RequestHandler } from "express";

import { CookiesConfig } from "~/config/cookiesConfig";
import { DBConnection } from "~/database/connection";
import { userDB } from "~/database/user/userDatabase";
import { sessionUtils } from "~/utils/sessionUtils";

export const sessionHandler =
  (params: {
    knex: DBConnection;
    cookiesConfig: CookiesConfig;
  }): RequestHandler =>
  async (req, _, next) => {
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

    const user = await userDB.getByUUID({
      knex: params.knex,
      userUUID: jwtPayload.uuid,
    });

    if (user) {
      // eslint-disable-next-line no-param-reassign
      req.user = user;
    }

    next();
  };
