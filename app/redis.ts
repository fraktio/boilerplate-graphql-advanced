import { BaseRedisCache } from "apollo-server-cache-redis";
import Redis from "ioredis";

import { RedisOnConfig } from "~/config/configs/redisConfig";
import { Logger } from "~/logger";

export const createRedis = (params: {
  redisConfig: RedisOnConfig;
  logger: Logger;
}): BaseRedisCache => {
  const client = new Redis({
    host: params.redisConfig.credentials.host,
    port: params.redisConfig.credentials.port,
    // password: params.redisConfig.passowrd,
    // username: params.redisConfig.username,
    retryStrategy(times): number {
      const delay = Math.min(times * 50, 2000);

      return delay;
    },

    reconnectOnError(err): boolean {
      const targetError = "READONLY";

      return err.message.includes(targetError);
    },
  });

  const redisApollo = new BaseRedisCache({
    client: client,
  });

  client.on("connect", () => {
    params.logger.info("Redis connected");
  });
  client.on("reconnecting", () => {
    params.logger.fatal("Redis reconnecting");
  });
  client.on("ready", () => {
    params.logger.info("Redis ready");
  });
  client.on("error", (err) => {
    params.logger.error(err, "Redis error");
  });
  client.on("end", () => {
    params.logger.info("Redis end");
  });

  return redisApollo;
};
