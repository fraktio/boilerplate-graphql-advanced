import { config } from "dotenv";

import { createDatabaseConfig } from "./app/config/databaseConfig";
import { getConnection } from "./app/database/connection";

// This file is for knex migrations

config();

const envDatabaseConfig = createDatabaseConfig();

module.exports = getConnection({ databaseConfig: envDatabaseConfig });
