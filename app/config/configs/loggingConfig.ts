import { LOGGING_LEVEL } from "~/config/envNames";
import { getEnv, getEnvPackageJSON } from "~/config/getters";

export enum LoggingLevel {
  trace = "trace",
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
  fatal = "fatal",
}

const acceptedValues = Object.values(LoggingLevel);

export type LoggingConfig = {
  loggingLevel: LoggingLevel;
  version: string;
  name: string;
};

export const createLoggingConfig = (): LoggingConfig => {
  const packageInfo = getEnvPackageJSON();

  return {
    loggingLevel: getEnv(LOGGING_LEVEL, acceptedValues),
    version: packageInfo.version,
    name: packageInfo.name,
  };
};
