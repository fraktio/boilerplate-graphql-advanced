import { API_CORS_ENDPOINT, API_PORT, IS_PRODUCTION } from "~/config/envNames";
import { getEnv, getEnvBool, getEnvInt } from "~/config/getters";

export type EnvConfig = {
  apiCorsEndpoint: string;
  apiPort: number;
  isProduction: boolean;
};

export const createEnvConfig = (): EnvConfig => ({
  apiCorsEndpoint: getEnv(API_CORS_ENDPOINT),
  apiPort: getEnvInt(API_PORT),
  isProduction: getEnvBool(IS_PRODUCTION),
});
