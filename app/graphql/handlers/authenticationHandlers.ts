import { Response } from "express";

import { Config } from "~/config";
import { userDS } from "~/dataSources/UserDataSource";
import { DBConnection } from "~/database/connection";
import { hashingUtils } from "~/utils/hashingUtils";
import { sessionUtils } from "~/utils/sessionUtils";

export const logoutHandler = async (params: {
  res: Response;
  config: Config;
}) => {
  sessionUtils.clearSessions({
    res: params.res,
    path: params.config.tokenPath,
  });

  return true;
};

type LoginHandlerInput = {
  password: string;
  username: string;
};

export const loginHandler = async (params: {
  knex: DBConnection;
  res: Response;
  input: LoginHandlerInput;
  config: Config;
}) => {
  const user = await userDS.getByUsername({
    knex: params.knex,
    username: params.input.username,
  });

  if (!user) {
    return { success: false, error: "failure" };
  }

  const isValidPassword = await hashingUtils.validatePassword({
    password: params.input.password,
    hash: user.hashedPassword,
  });

  if (!isValidPassword) {
    return {
      __typename: "LoginUserFailure",
      success: false,
    };
  }

  const { refreshToken } = sessionUtils.generateRefreshToken({
    user,
    secret: params.config.tokenSecret,
    tokenAgeSeconds: params.config.refreshTokenAgeSeconds,
  });

  sessionUtils.setRefreshToken({
    res: params.res,
    refreshToken,
    refreshTokenAgeSeconds: params.config.refreshTokenAgeSeconds,
    domain: params.config.tokenDomain,
    tokenPath: params.config.tokenPath,
  });

  return {
    __typename: "LoginUserSuccess",
    user,
  };
};
