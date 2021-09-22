import {
  API_CORS_ENDPOINT,
  API_PORT,
  API_EXPOSE_ERRORS,
  IS_PRODUCTION,
} from "~/config/envNames";
import { getEnv, getEnvBool, getEnvInt } from "~/config/getters";

export type EnvConfig = {
  apiCorsEndpoint: string;
  apiPort: number;
  apiExposeErrors: boolean;
  isProduction: boolean;
};

export const createEnvConfig = (): EnvConfig => ({
  apiCorsEndpoint: getEnv(API_CORS_ENDPOINT),
  apiPort: getEnvInt(API_PORT),
  apiExposeErrors: getEnvBool(API_EXPOSE_ERRORS),
  isProduction: getEnvBool(IS_PRODUCTION),
});
