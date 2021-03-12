import { toFailure, toSuccess } from "../validation";

describe("utils / validation", () => {
  it("toSuccess", async () => {
    const response = toSuccess("fail-message");

    expect(response).toMatchObject({
      success: true,
      value: "fail-message",
    });
  });

  it("toFailure", async () => {
    const response = toFailure("success-message");

    expect(response).toMatchObject({
      success: false,
      failure: "success-message",
    });
  });
});
