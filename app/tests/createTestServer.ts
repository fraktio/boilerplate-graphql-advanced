import { createServer, CreateServerResponse } from "~/server";
import { createTestConfig } from "~/tests/testConfig";

export const createTestServer = (): CreateServerResponse =>
  createServer({ config: createTestConfig() });
