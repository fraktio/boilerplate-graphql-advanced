import { APIConfig, createAPIConfig } from "~/config/configs/apiConfig";
import {
  createDatabaseConfig,
  DatabaseConfig,
} from "~/config/configs/databaseConfig";
import { createEnvConfig, EnvConfig } from "~/config/configs/envConfig";
import {
  createGraphqlgConfig,
  GraphqlConfig,
} from "~/config/configs/graphqlConfig";
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
  graphql: GraphqlConfig;
  env: EnvConfig;
  logging: LoggingConfig;
  platform: PlatformConfig;
  session: SessionConfig;
};

export const createConfig = (): Config => ({
  api: createAPIConfig(),
  database: createDatabaseConfig(),
  graphql: createGraphqlgConfig(),
  env: createEnvConfig(),
  logging: createLoggingConfig(),
  platform: createPlatformConfig(),
  session: createSessionConfig(),
});
