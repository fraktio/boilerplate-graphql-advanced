/* eslint-disable no-process-env */

/*
import { SecretsManager } from "aws-sdk";
import SSM from "aws-sdk/clients/ssm";

const SM = new SecretsManager({});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAwsSecretAsync = async (secretName: string) =>
  await SM.getSecretValue({ SecretId: secretName }).promise();

const ssm = new SSM();
const getParams = async (names: string[]) => {
  const result = await ssm
    .getParameters({
      Names: names,
      // WithDecryption: true,
    })
    .promise();

  return result;
};
*/
const requireEnv = (env: string): string => {
  const envVariable = process.env[env];

  if (!envVariable) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  return envVariable;
};

const requireIntEnv = (env: string): number => {
  const envValue = process.env[env];

  if (!envValue) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  const parsed = parseInt(envValue, 10);

  if (!parsed || isNaN(parsed)) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  return parsed;
};

const requireBoolean = (env: string): boolean => {
  const envValue = process.env[env];

  if (!envValue) {
    throw new Error(`Environment variable ${env} is missing!`);
  }

  if (envValue === "TRUE") {
    return true;
  }

  if (envValue === "FALSE") {
    return false;
  }

  throw new Error(
    `Environment variable ${env} only accepts 'TRUE' or 'FALSE'!`,
  );
};

export const getCookiesConfigFromEnv = () => ({
  path: requireEnv("TOKEN_PATH"),
  domain: requireEnv("TOKEN_DOMAIN"),
  secret: requireEnv("TOKEN_SECRET"),
  accessAgeSeconds: requireIntEnv("ACCESS_TOKEN_AGE_SECONDS"),
  refreshAgeSeconds: requireIntEnv("REFRESH_TOKEN_AGE_SECONDS"),
});

export type CookiesConfig = ReturnType<typeof getCookiesConfigFromEnv>;

export const getDatabaseConfigFromEnv = () => ({
  type: requireEnv("DATABASE_TYPE"),
  host: requireEnv("DATABASE_HOST"),
  user: requireEnv("DATABASE_USER"),
  port: requireIntEnv("DATABASE_PORT"),
  password: requireEnv("DATABASE_PASSWORD"),
  databaseName: requireEnv("DATABASE_DATABASE_NAME"),
});

export type DatabaseConfig = ReturnType<typeof getDatabaseConfigFromEnv>;

export const getConfigFromEnv = () => ({
  apiPort: requireIntEnv("API_PORT"),
  stdoutLogging: requireBoolean("STDOUT_LOGGING"),
  isProduction: requireBoolean("PRODUCTION"),
  apiCorsEndpoint: requireEnv("API_CORS_ENDPOINT"),

  cookies: getCookiesConfigFromEnv(),
  database: getDatabaseConfigFromEnv(),
});

export type Config = ReturnType<typeof getConfigFromEnv>;
