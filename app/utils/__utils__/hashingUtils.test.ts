import { hashingUtils } from "~/utils/hashingUtils";

const password = "password";

describe("utils / hashing", () => {
  it("createUUID", async () => {
    const hash = await hashingUtils.hashPassword({ password });

    const validated = await hashingUtils.validatePassword({ password, hash });
    expect(validated).toBeTruthy();
  });
});
