import request from "supertest";

import { createTestServer } from "~/tests/createTestServer";
import { registerTestHandlers } from "~/tests/registerTestHandlers";

const { app, startServer } = createTestServer();
registerTestHandlers({ startServer });

describe("Express / endpoints", () => {
  it("GET /version", async () => {
    const response = await request(app).get("/version").send();

    expect(response.status).toBe(200);
    expect(response.text).toEqual(expect.any(String));
  });
});
