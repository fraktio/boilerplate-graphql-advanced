import { RequestHandler } from "express";

import { SessionConfig } from "~/config/configs/sessionConfig";
import { DBSession } from "~/database/connection";
import { userQueries } from "~/database/user/userQueries";
import { sessionUtils } from "~/utils/sessionUtils";

export const sessionHandler =
  (params: { knex: DBSession; sessionConfig: SessionConfig }): RequestHandler =>
  async (req, _, next): Promise<void> => {
    const tokenResponse = sessionUtils.authentication.verifyToken({
      req,
      sessionConfig: params.sessionConfig,
    });

    if (!tokenResponse.success) {
      return next();
    }

    const user = await userQueries.getByUUID({
      knex: params.knex,
      userUUID: tokenResponse.value.uuid,
    });

    if (user) {
      // eslint-disable-next-line no-param-reassign
      req.user = user;
    }

    next();
  };
