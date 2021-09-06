import { LoggingBunyan } from "@google-cloud/logging-bunyan";
import bunyan, { Stream } from "bunyan";

import { LoggingConfig } from "~/config/configs/loggingConfig";
import { Platform, PlatformConfig } from "~/config/configs/platformConfig";

export type Logger = bunyan;

const createStreams = (params: {
  loggingConfig: LoggingConfig;
  platformConfig: PlatformConfig;
}): Stream[] => {
  const { loggingLevel } = params.loggingConfig;

  switch (params.platformConfig.type) {
    case Platform.GoogleCloudPlatform:
      return [new LoggingBunyan().stream(loggingLevel)];

    case Platform.Local:
    default:
      return [
        {
          level: loggingLevel,
          stream: process.stdout,
        },
      ];
  }
};

export const createLogger = (params: {
  loggingConfig: LoggingConfig;
  platformConfig: PlatformConfig;
}): Logger =>
  bunyan.createLogger({
    name: params.loggingConfig.name,
    version: params.loggingConfig.version,
    streams: createStreams(params),
  });
