import {
  IS_REDIS_USED,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
} from "~/config/envNames";
import { getEnv, getEnvBool, getEnvInt } from "~/config/getters";

export type RedisCredentials = {
  host: string;
  port: number;
  username: string;
  passowrd: string;
};

export type RedisOffConfig = {
  useRedis: false;
};

export type RedisOnConfig = {
  useRedis: true;
  credentials: RedisCredentials;
};

export type RedisConfig = RedisOffConfig | RedisOnConfig;

export const createRedisConfig = (): RedisConfig => {
  const useRedis = getEnvBool(IS_REDIS_USED);

  if (useRedis) {
    return {
      useRedis: true,
      credentials: {
        host: getEnv(REDIS_HOST),
        port: getEnvInt(REDIS_PORT),
        username: getEnv(REDIS_USERNAME),
        passowrd: getEnv(REDIS_PASSWORD),
      },
    };
  }

  return {
    useRedis: false,
  };
};
