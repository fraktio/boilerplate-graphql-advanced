import { config } from "dotenv";

import { getConfigFromEnv } from "./src/config";
import { getConnection } from "./src/database/connection";

// This file is for knex migrations

config();

const envConfig = getConfigFromEnv();

module.exports = getConnection({ config: envConfig });
