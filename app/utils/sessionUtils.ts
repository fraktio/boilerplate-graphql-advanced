import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { DateTime } from "luxon";

import { UserTable } from "~/dataSources/user/userDatabase";
import { UUID } from "~/models";

export enum Cookie {
  AccessToken = "access-token",
  RefreshToken = "refresh-token",
}

export type JWTAccessPayload = {
  uuid: UUID;
};

export type JWTRefreshPayload = {
  uuid: UUID;
};

export const sessionUtils = {
  getTokenExpireDate(opts: { age: number }) {
    return DateTime.utc().plus({
      second: opts.age * 1000,
    });
  },

  generateRefreshToken(params: {
    user: UserTable;
    secret: string;
    tokenAgeSeconds: number;
  }) {
    const signObj: JWTRefreshPayload = { uuid: params.user.UUID };
    const expiresAt = sessionUtils.getTokenExpireDate({
      age: params.tokenAgeSeconds,
    });

    const refreshToken = sign(signObj, params.secret, {
      expiresIn: params.tokenAgeSeconds,
    });

    return {
      refreshToken,
      expiresAt,
    };
  },

  generateAccessToken(params: {
    user: UserTable;
    secret: string;
    tokenAgeSeconds: number;
  }) {
    const signObj: JWTAccessPayload = { uuid: params.user.UUID };
    const expiresAt = sessionUtils.getTokenExpireDate({
      age: params.tokenAgeSeconds,
    });

    const accessToken = sign(signObj, params.secret, {
      expiresIn: params.tokenAgeSeconds,
    });

    return {
      accessToken,
      expiresAt,
    };
  },

  setAccessToken(params: {
    res: Response;
    accessToken: string;
    tokenAgeSeconds: number;
    tokenDomain: string;
  }) {
    params.res.cookie(Cookie.AccessToken, params.accessToken, {
      expires: sessionUtils
        .getTokenExpireDate({
          age: params.tokenAgeSeconds,
        })
        .toJSDate(),
      domain: params.tokenDomain,
      sameSite: "strict",
    });
  },

  setRefreshToken(params: {
    res: Response;
    refreshToken: string;
    refreshTokenAgeSeconds: number;
    domain: string;
    tokenPath: string;
  }) {
    params.res.cookie(Cookie.RefreshToken, params.refreshToken, {
      expires: sessionUtils
        .getTokenExpireDate({
          age: params.refreshTokenAgeSeconds,
        })
        .toJSDate(),
      httpOnly: true,
      // secure: this.config.isProduction,

      domain: params.domain,
      path: params.tokenPath,
      sameSite: "strict",
    });
  },

  verifyAccessPayload(params: { token: string; secret: string }) {
    try {
      return verify(params.token, params.secret) as JWTAccessPayload;
    } catch (e) {
      return null;
    }
  },

  verifyRefreshPayload(params: { token: string; tokenSecret: string }) {
    try {
      return verify(params.token, params.tokenSecret) as JWTRefreshPayload;
    } catch (e) {
      return null;
    }
  },

  clearSessions(params: { res: Response; path: string }): void {
    params.res.clearCookie(Cookie.RefreshToken, { path: params.path });
    params.res.clearCookie(Cookie.AccessToken);
  },

  getRefreshToken(opts: { req: Request }): string | null {
    return opts.req.cookies[Cookie.RefreshToken] || null;
  },

  getAccessToken(opts: { req: Request }): string | null {
    return opts.req.cookies[Cookie.AccessToken] || null;
  },
};
