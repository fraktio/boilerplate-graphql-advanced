import { config } from "dotenv";

import { getConnection } from "./dbConfig";
import { getConfigFromEnv } from "./src/config";

// This file is for knex migrations

config();

const envConfig = getConfigFromEnv();

module.exports = getConnection({ config: envConfig });
