import bunyan from "bunyan";

import { Config } from "~/config/config";

export type Logger = bunyan;

export const createLogger = (opts: { config: Config }): Logger =>
  bunyan.createLogger({
    name: opts.config.logging.name,
    version: opts.config.logging.version,
    streams: [
      {
        level: opts.config.logging.loggingLevel,
        stream: process.stdout,
      },
    ],
  });
