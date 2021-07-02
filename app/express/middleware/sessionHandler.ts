import { RequestHandler } from "express";

import { CookiesConfig } from "~/config/cookiesConfig";
import { DBSession } from "~/database/connection";
import { userQueries } from "~/database/user/userQueries";
import { sessionUtils } from "~/utils/sessionUtils";

export const sessionHandler =
  (params: { knex: DBSession; cookiesConfig: CookiesConfig }): RequestHandler =>
  async (req, _, next): Promise<void> => {
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

    const user = await userQueries.getByUUID({
      knex: params.knex,
      userUUID: jwtPayload.uuid,
    });

    if (user) {
      // eslint-disable-next-line no-param-reassign
      req.user = user;
    }

    next();
  };
