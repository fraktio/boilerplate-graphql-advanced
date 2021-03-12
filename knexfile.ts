import { config } from "dotenv";

import { getDatabaseConfigFromEnv } from "./app/config";
import { getConnection } from "./app/database/connection";

// This file is for knex migrations

config();

const envDatabaseConfig = getDatabaseConfigFromEnv();

module.exports = getConnection({ databaseConfig: envDatabaseConfig });
