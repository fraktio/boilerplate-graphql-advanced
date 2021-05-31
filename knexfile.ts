import { config } from "dotenv";

import { createDatabaseConfig } from "~/config/databaseConfig";
import { getConnection } from "~/database/connection";

// This file is for knex migrations

config();

const envDatabaseConfig = createDatabaseConfig();

module.exports = getConnection({ databaseConfig: envDatabaseConfig });
