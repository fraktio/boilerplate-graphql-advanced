import { BaseRedisCache } from "apollo-server-cache-redis";
import Redis from "ioredis";

import { RedisOnConfig } from "~/config/configs/redisConfig";

export const createRedis = (params: {
  redisConfig: RedisOnConfig;
}): BaseRedisCache =>
  new BaseRedisCache({
    client: new Redis({
      host: params.redisConfig.credentials.host,
      port: params.redisConfig.credentials.port,
      // password: params.redisConfig.passowrd,
      // username: params.redisConfig.username,
    }),
  });
