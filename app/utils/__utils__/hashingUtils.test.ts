import { hashingUtils } from "~/utils/hashingUtils";

const password = "password";

describe("utils / hashing", () => {
  it("createUUID", async () => {
    const hash = await hashingUtils.hashPassword({ password });

    const validated = await hashingUtils.validatePassword({ password, hash });
    expect(validated).toBeTruthy();
  });

  it("base64ToString", () => {
    expect(hashingUtils.stringToBase64("thisIsATestString")).toBe(
      "dGhpc0lzQVRlc3RTdHJpbmc=",
    );
  });

  it("stringToBase64", () => {
    expect(hashingUtils.base64ToString("bm90QVRlc3RTdHJpbmc=")).toBe(
      "notATestString",
    );
  });
});
