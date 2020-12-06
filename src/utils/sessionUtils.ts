import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { DateTime } from "luxon";

import { Cookie } from "~/@types/session";
import { Config } from "~/config";
import { UserTable } from "~/dataSources/UserDataSource";
import { UUID } from "~/models";

export type JWTAccessPayload = {
  uuid: UUID;
};

export type JWTRefreshPayload = {
  uuid: UUID;
};

export class SessionUtils {
  private config: Config;

  constructor(opts: { config: Config }) {
    this.config = opts.config;
  }

  generateRefreshToken = (opts: { user: UserTable }) => {
    const signObj: JWTRefreshPayload = { uuid: opts.user.uuid };
    const expiresAt = this.getTokenExpireDate({
      age: this.config.accessTokenAgeSeconds,
    });

    const refreshToken = sign(signObj, this.config.tokenSecret, {
      expiresIn: this.config.refreshTokenAgeSeconds,
    });

    return {
      refreshToken,
      expiresAt,
    };
  };

  generateAccessToken = (opts: { user: UserTable }) => {
    const signObj: JWTAccessPayload = { uuid: opts.user.uuid };
    const expiresAt = this.getTokenExpireDate({
      age: this.config.accessTokenAgeSeconds,
    });

    const accessToken = sign(signObj, this.config.tokenSecret, {
      expiresIn: this.config.accessTokenAgeSeconds,
    });

    return {
      accessToken,
      expiresAt,
    };
  };

  setAccessToken = (opts: { res: Response; accessToken: string }) => {
    opts.res.cookie(Cookie.AccessToken, opts.accessToken, {
      expires: this.getTokenExpireDate({
        age: this.config.accessTokenAgeSeconds,
      }).toJSDate(),
      domain: this.config.tokenDomain,
      sameSite: "strict",
    });
  };

  setRefreshToken = (opts: { res: Response; refreshToken: string }) => {
    opts.res.cookie(Cookie.RefreshToken, opts.refreshToken, {
      expires: this.getTokenExpireDate({
        age: this.config.refreshTokenAgeSeconds,
      }).toJSDate(),
      httpOnly: true,
      secure: this.config.isProduction,

      domain: this.config.tokenDomain,
      path: this.config.tokenPath,
      sameSite: "strict",
    });
  };

  verifyAccessPayload = (opts: { token: string }) => {
    try {
      return verify(opts.token, this.config.tokenSecret) as JWTAccessPayload;
    } catch (e) {
      return null;
    }
  };

  verifyRefreshPayload = (opts: { token: string }) => {
    try {
      return verify(opts.token, this.config.tokenSecret) as JWTRefreshPayload;
    } catch (e) {
      return null;
    }
  };

  clearSessions = (opts: { res: Response }): void => {
    opts.res.clearCookie(Cookie.RefreshToken, { path: this.config.tokenPath });
    opts.res.clearCookie(Cookie.AccessToken);
  };

  getTokenExpireDate = (opts: { age: number }) =>
    DateTime.utc().plus({
      second: opts.age * 1000,
    });

  getRefreshToken = (opts: { req: Request }): string | null =>
    opts.req.cookies[Cookie.RefreshToken] || null;

  getAccessToken = (opts: { req: Request }): string | null =>
    opts.req.cookies[Cookie.AccessToken] || null;
}
