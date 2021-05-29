import { createTestConfig } from "~/config/testConfig";
import { createServer, CreateServerResponse } from "~/server";

export const createTestServer = (): CreateServerResponse =>
  createServer({ config: createTestConfig() });
