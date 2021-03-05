import { Response } from "express";

import { CookiesConfig } from "~/config";
import { userDS } from "~/dataSources/UserDataSource";
import { DBConnection } from "~/database/connection";
import { hashingUtils } from "~/utils/hashingUtils";
import { sessionUtils } from "~/utils/sessionUtils";
import { toFailure, toSuccess } from "~/validation/common";

type LoginHandlerInput = {
  password: string;
  username: string;
};

export enum LogInHandlerErrors {
  UserNotFound = "user-not-found",
  InvalidPassword = "invalid-password",
}

export const loginHandler = async (params: {
  knex: DBConnection;
  res: Response;
  input: LoginHandlerInput;
  cookiesConfig: CookiesConfig;
}) => {
  const user = await userDS.getByUsername({
    knex: params.knex,
    username: params.input.username,
  });

  if (!user) {
    return toFailure(LogInHandlerErrors.UserNotFound);
  }

  const isValidPassword = await hashingUtils.validatePassword({
    password: params.input.password,
    hash: user.hashedPassword,
  });

  if (!isValidPassword) {
    return toFailure(LogInHandlerErrors.InvalidPassword);
  }

  const { refreshToken } = sessionUtils.generateRefreshToken({
    user,
    secret: params.cookiesConfig.secret,
    tokenAgeSeconds: params.cookiesConfig.refreshAgeSeconds,
  });

  sessionUtils.setRefreshToken({
    res: params.res,
    refreshToken,
    refreshTokenAgeSeconds: params.cookiesConfig.refreshAgeSeconds,
    domain: params.cookiesConfig.domain,
    tokenPath: params.cookiesConfig.path,
  });

  return toSuccess(user);
};

export const logoutHandler = async (params: {
  res: Response;
  cookiesConfig: CookiesConfig;
}) => {
  sessionUtils.clearSessions({
    res: params.res,
    path: params.cookiesConfig.path,
  });

  return true;
};
