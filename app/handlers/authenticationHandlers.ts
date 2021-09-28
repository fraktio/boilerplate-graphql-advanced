import { Response } from "express";

import { EnvConfig } from "~/config/configs/envConfig";
import { SessionConfig } from "~/config/configs/sessionConfig";
import { DBSession } from "~/database/connection";
import { UserDataLoader } from "~/database/user/UserDataLoader";
import { userDB } from "~/database/user/userDatabase";
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

type LoginSuccesPlayload = {
  user: UserTable;
  token: string;
};

export const loginHandler = async (params: {
  knex: DBSession;
  res: Response;
  input: LoginHandlerInput;
  sessionConfig: SessionConfig;
  envConfig: EnvConfig;
  userDL: UserDataLoader;
}): Promise<Try<LoginSuccesPlayload, LogInHandlerErrors>> => {
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

  const { accessToken } = sessionUtils.authentication.generateAndSetToken({
    res: params.res,
    user,
    sessionConfig: params.sessionConfig,
    envConfig: params.envConfig,
  });

  return toSuccess({
    user,
    token: accessToken,
  });
};

export const logoutHandler = async (params: {
  res: Response;
  sessionConfig: SessionConfig;
}): Promise<boolean> => {
  sessionUtils.authentication.clear({
    res: params.res,
    path: params.sessionConfig.path,
  });

  return true;
};
