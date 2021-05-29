import request from "supertest";

import { createTestServer } from "~/tests/createTestServer";
import { registerTestHandlers } from "~/tests/registerTestHandlers";

const { app, knex } = createTestServer();
registerTestHandlers({ knex });

describe("Express / endpoints", () => {
  it("GET /health", async () => {
    const response = await request(app).get("/health").send();

    expect(response.status).toBe(200);
    expect(response.text).toBe("OK");
  });
});
