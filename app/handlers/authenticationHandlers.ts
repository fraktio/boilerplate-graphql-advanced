import { Response } from "express";

import { CookiesConfig } from "~/config/cookiesConfig";
import { DBConnection } from "~/database/connection";
import { UserDataLoader } from "~/database/user/UserDataLoader";
import { userDB } from "~/database/user/UserDatabase";
import { UserTable } from "~/database/user/userQueries";
import { hashingUtils } from "~/utils/hashingUtils";
import { sessionUtils } from "~/utils/sessionUtils";
import { toFailure, toSuccess, Try } from "~/utils/validation";

export const authenticatedUserHandler = async (params: {
  authenticatedUser: UserTable;
}): Promise<UserTable> => params.authenticatedUser;

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
  userDL: UserDataLoader;
}): Promise<Try<UserTable, LogInHandlerErrors>> => {
  const user = await userDB.getByUsername({
    knex: params.knex,
    username: params.input.username,
    userDL: params.userDL,
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
}): Promise<boolean> => {
  sessionUtils.clearSessions({
    res: params.res,
    path: params.cookiesConfig.path,
  });

  return true;
};
