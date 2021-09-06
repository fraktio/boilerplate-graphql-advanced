import { Response, Request } from "express";
import { verify } from "jsonwebtoken";

import { EnvConfig } from "~/config/configs/envConfig";
import { SessionConfig } from "~/config/configs/sessionConfig";
import { UserTable } from "~/database/user/userQueries";
import { sessionUtils } from "~/utils/sessionUtils";

describe("utils / hashing", () => {
  const SECRET = "secret";
  const mockSessionConfig: SessionConfig = {
    path: "/",
    domain: "domain",
    secret: SECRET,
    accessTokenAgeSeconds: 999,
    refreshTokenAgeSeconds: 9999,
  };

  const mockEnvConfig: EnvConfig = {
    apiPort: 999,
    isProduction: true,
    apiCorsEndpoint: "endpoint",
  };

  it("generateRefreshToken & verifyRefreshPayload", async () => {
    const mockCallback = jest.fn();
    const SECRET = "secret";
    const mockUser = {
      UUID: "mockUUID",
    } as unknown as UserTable;

    const accessToken = sessionUtils.authentication.generateAndSetToken({
      res: {
        cookie: mockCallback,
      } as unknown as Response,
      user: mockUser,
      sessionConfig: mockSessionConfig,
      envConfig: mockEnvConfig,
    });

    expect(verify(accessToken.accessToken, SECRET)).toMatchObject({
      uuid: mockUser.UUID,
    });

    const result = sessionUtils.authentication.verifyToken({
      req: {
        cookies: {
          authorization: accessToken.accessToken,
        },
      } as unknown as Request,
      sessionConfig: mockSessionConfig,
    });

    expect(result).toMatchObject({
      success: true,
      value: { uuid: "mockUUID" },
    });

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls).toMatchObject([
      [
        "authorization",
        expect.any(String),
        {
          domain: "domain",
          expires: expect.any(Date),
          sameSite: "strict",
        },
      ],
    ]);
  });
});
