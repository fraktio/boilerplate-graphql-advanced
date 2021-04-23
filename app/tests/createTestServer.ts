import { createTestConfig } from "~/config/tests";
import { createServer } from "~/server";

export const createTestServer = () =>
  createServer({ config: createTestConfig() });
