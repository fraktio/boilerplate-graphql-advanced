import { config } from "dotenv";

import { getConnection } from "./app/database/connection";

import { createDatabaseConfig } from "~/config/databaseConfig";

// This file is for knex migrations

config();

const envDatabaseConfig = createDatabaseConfig();

module.exports = getConnection({ databaseConfig: envDatabaseConfig });
