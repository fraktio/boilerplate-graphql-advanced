import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { DateTime } from "luxon";

import { EnvConfig } from "~/config/configs/envConfig";
import { SessionConfig } from "~/config/configs/sessionConfig";
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
      seconds: opts.ageSeconds * 1000,
    });
  }

  public generateAndSetToken(params: {
    res: Response;
    user: UserTable;
    sessionConfig: SessionConfig;
    envConfig: EnvConfig;
  }): GenerateAccessTokenResponse {
    const signObj: JWTAccessPayload = { uuid: params.user.id };

    const accessToken = sign(signObj, params.sessionConfig.secret, {
      expiresIn: params.sessionConfig.accessTokenAgeSeconds,
    });

    const expiresAt = this.getTokenExpireDate({
      ageSeconds: params.sessionConfig.accessTokenAgeSeconds,
    });

    params.res.cookie(this.AUTHORIZATION_HEADER, accessToken, {
      expires: expiresAt.toJSDate(),
      // domain: params.sessionConfig.domain,
      sameSite: "lax",
      httpOnly: true,
      secure: true,
    });

    return {
      accessToken,
      expiresAt,
    };
  }

  public getToken(params: { req: Request }): Try<string, null> {
    const authCookie = params.req.cookies[this.AUTHORIZATION_HEADER];

    if (authCookie) {
      return toSuccess(authCookie);
    }

    const authHeader = params.req.headers.authorization;

    if (!authHeader) {
      return toFailure(null);
    }

    if (!authHeader.startsWith("Bearer")) {
      return toFailure(null);
    }

    const [_, token] = authHeader.split(" ");

    if (token) {
      return toSuccess(token);
    }

    return toFailure(null);
  }

  public verifyToken(params: {
    req: Request;
    sessionConfig: SessionConfig;
  }): Try<JWTAccessPayload, null> {
    const authToken = this.getToken({ req: params.req });

    if (!authToken.success) {
      return toFailure(null);
    }

    try {
      const verifiedPayload = verify(
        authToken.value,
        params.sessionConfig.secret,
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
