import { config } from "dotenv";

import { createDatabaseConfig } from "~/config/configs/databaseConfig";
import { createPlatformConfig } from "~/config/configs/platformConfig";
import { getConnection } from "~/database/connection";

// This file is for knex migrations

config();

const databaseConfig = createDatabaseConfig();
const platformConfig = createPlatformConfig();

module.exports = getConnection({
  databaseConfig,
  platformConfig,
});
