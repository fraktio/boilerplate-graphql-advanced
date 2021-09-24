import fs from "fs";
/* eslint-disable no-process-env */

export const getEnv = <T extends string>(
  envKey: string,
  allowedValues?: T[],
): T => {
  const value = process.env[envKey];

  if (allowedValues) {
    if (allowedValues.includes((value ?? "") as T)) {
      return (value ?? "") as T;
    }
  }

  if (value) {
    return value as T;
  }

  if (allowedValues) {
    console.error(
      `Environment variable ${envKey} is not set, accepted values: ${allowedValues
        .map((value) => `"${value}"`)
        .join(", ")}`,
    );
    process.exit(1);
  }

  console.error(`Environment variable ${envKey} is not set`);
  process.exit(1);
};

export const getEnvInt = (envKey: string): number => {
  const value = getEnv(envKey);

  const integerRegex = /^\d+$/;

  if (!integerRegex.test(value)) {
    console.error(
      `Environment variable ${envKey}. Received invalid value for INT: ${value}`,
    );
    process.exit(1);
  }

  return parseInt(value, 10);
};

export const getEnvBool = (envKey: string): boolean => {
  const value = getEnv(envKey);

  if (value === "TRUE") {
    return true;
  }

  if (value === "FALSE") {
    return false;
  }

  console.error(
    `Environment variable ${envKey}. Accepted values: 'TRUE' or 'FALSE' Received invalid value for BOOLEAN: ${value}`,
  );
  process.exit(1);
};

export const getEnvFallback = (envKey: string, fallback: string): string => {
  const value = process.env[envKey];

  if (!value) {
    return fallback;
  }

  return value;
};

export const getEnvIntFallback = (envKey: string, fallback: number): number => {
  const value = process.env[envKey];

  if (!value) {
    return fallback;
  }

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    console.error(
      `Environment variable ${envKey}. Received invalid value for INT: ${value}`,
    );
    process.exit(1);
  }

  return parsed;
};

type Package = {
  name: string;
  version: string;
};

export const getEnvPackageJSON = (): Package => {
  try {
    return JSON.parse(fs.readFileSync("package.json", "utf8")) as Package;
  } catch (e) {
    console.error(
      "'package.json' was not found. 'package.json' is needed in the root directory.",
    );
    process.exit(1);
  }
};
