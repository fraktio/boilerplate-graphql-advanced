import { verify } from "jsonwebtoken";

import { sessionUtils } from "../sessionUtils";

import { UserTable } from "~/database/user/userQueries";

describe("utils / hashing", () => {
  it("generateRefreshToken & verifyRefreshPayload", async () => {
    const SECRET = "secret";
    const mockUser = {
      UUID: "mockUUID",
    } as unknown as UserTable;

    const refreshToken = sessionUtils.generateRefreshToken({
      user: mockUser,
      secret: SECRET,
      tokenAgeSeconds: 1234,
    });

    expect(verify(refreshToken.refreshToken, SECRET)).toMatchObject({
      uuid: mockUser.UUID,
    });

    const result = sessionUtils.verifyRefreshPayload({
      token: refreshToken.refreshToken,
      tokenSecret: SECRET,
    });

    expect(result?.uuid).toBe(mockUser.UUID);
  });

  it("generateRefreshToken & verifyRefreshPayload", async () => {
    const SECRET = "secret";
    const mockUser = {
      UUID: "mockUUID",
    } as unknown as UserTable;

    const accessToken = sessionUtils.generateAccessToken({
      user: mockUser,
      secret: SECRET,
      tokenAgeSeconds: 1234,
    });

    expect(verify(accessToken.accessToken, SECRET)).toMatchObject({
      uuid: mockUser.UUID,
    });

    const result = sessionUtils.verifyAccessPayload({
      token: accessToken.accessToken,
      secret: SECRET,
    });

    expect(result?.uuid).toBe(mockUser.UUID);
  });
});
