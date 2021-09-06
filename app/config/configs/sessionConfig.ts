import {
  ACCESS_TOKEN_AGE_SECONDS,
  REFRESH_TOKEN_AGE_SECONDS,
  TOKEN_DOMAIN,
  TOKEN_PATH,
  TOKEN_SECRET,
} from "~/config/envNames";
import { getEnv, getEnvInt } from "~/config/getters";

export type SessionConfig = {
  path: string;
  domain: string;
  secret: string;
  accessTokenAgeSeconds: number;
  refreshTokenAgeSeconds: number;
};

export const createSessionConfig = (): SessionConfig => ({
  path: getEnv(TOKEN_PATH),
  domain: getEnv(TOKEN_DOMAIN),
  secret: getEnv(TOKEN_SECRET),
  accessTokenAgeSeconds: getEnvInt(ACCESS_TOKEN_AGE_SECONDS),
  refreshTokenAgeSeconds: getEnvInt(REFRESH_TOKEN_AGE_SECONDS),
});
