import { createTestConfig } from "~/config/testConfig";
import { createServer } from "~/server";

export const createTestServer = () =>
  createServer({ config: createTestConfig() });
