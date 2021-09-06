import { APIConfig, createAPIConfig } from "~/config/configs/apiConfig";
import {
  createDatabaseConfig,
  DatabaseConfig,
} from "~/config/configs/databaseConfig";
import { createEnvConfig, EnvConfig } from "~/config/configs/envConfig";
import {
  createLoggingConfig,
  LoggingConfig,
} from "~/config/configs/loggingConfig";
import {
  createPlatformConfig,
  PlatformConfig,
} from "~/config/configs/platformConfig";
import {
  createSessionConfig,
  SessionConfig,
} from "~/config/configs/sessionConfig";

export type Config = {
  api: APIConfig;
  database: DatabaseConfig;
  env: EnvConfig;
  logging: LoggingConfig;
  platform: PlatformConfig;
  session: SessionConfig;
};

export const createConfig = (): Config => ({
  api: createAPIConfig(),
  database: createDatabaseConfig(),
  env: createEnvConfig(),
  logging: createLoggingConfig(),
  platform: createPlatformConfig(),
  session: createSessionConfig(),
});
