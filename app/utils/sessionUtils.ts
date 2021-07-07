import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { DateTime } from "luxon";

import { CookiesConfig } from "~/config/cookiesConfig";
import { EnvConfig } from "~/config/envConfig";
import { UserTable } from "~/database/user/userQueries";
import { UUID } from "~/generation/mappers";
import { toFailure, toSuccess, Try } from "~/utils/validation";

type JWTAccessPayload = {
  uuid: UUID;
};

type GenerateAccessTokenResponse = {
  accessToken: string;
  expiresAt: DateTime;
};

class Authentication {
  private AUTHORIZATION_HEADER = "authorization";

  private getTokenExpireDate(opts: { ageSeconds: number }): DateTime {
    return DateTime.utc().plus({
      second: opts.ageSeconds * 1000,
    });
  }

  public generateAndSetToken(params: {
    res: Response;
    user: UserTable;
    cookieConfig: CookiesConfig;
    envConfig: EnvConfig;
  }): GenerateAccessTokenResponse {
    const signObj: JWTAccessPayload = { uuid: params.user.UUID };

    const accessToken = sign(signObj, params.cookieConfig.secret, {
      expiresIn: params.cookieConfig.accessTokenAgeSeconds,
    });

    const expiresAt = this.getTokenExpireDate({
      ageSeconds: params.cookieConfig.accessTokenAgeSeconds,
    });

    params.res.cookie(this.AUTHORIZATION_HEADER, accessToken, {
      expires: expiresAt.toJSDate(),
      domain: params.cookieConfig.domain,
      sameSite: "strict",
      httpOnly: true,
      secure: params.envConfig.isProduction,
    });

    return {
      accessToken,
      expiresAt,
    };
  }

  public verifyToken(params: {
    req: Request;
    cookiesConfig: CookiesConfig;
  }): Try<JWTAccessPayload, null> {
    const authHeader = params.req.cookies[this.AUTHORIZATION_HEADER];

    if (!authHeader) {
      return toFailure(null);
    }

    try {
      const verifiedPayload = verify(
        authHeader,
        params.cookiesConfig.secret,
      ) as JWTAccessPayload;

      return toSuccess(verifiedPayload);
    } catch (e) {
      return toFailure(null);
    }
  }

  public clear(params: { res: Response; path: string }): void {
    params.res.clearCookie(this.AUTHORIZATION_HEADER, { path: params.path });
  }
}

export const sessionUtils = {
  authentication: new Authentication(),
};
