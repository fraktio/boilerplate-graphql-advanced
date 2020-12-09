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

export const getConfigFromEnv = () => ({
  apiPort: requireIntEnv("API_PORT"),
  stdoutLogging: requireBoolean("STDOUT_LOGGING"),
  isProduction: requireBoolean("PRODUCTION"),
  apiCorsEndpoint: requireEnv("API_CORS_ENDPOINT"),

  tokenPath: requireEnv("TOKEN_PATH"),
  tokenDomain: requireEnv("TOKEN_DOMAIN"),
  tokenSecret: requireEnv("TOKEN_SECRET"),
  accessTokenAgeSeconds: requireIntEnv("ACCESS_TOKEN_AGE_SECONDS"),
  refreshTokenAgeSeconds: requireIntEnv("REFRESH_TOKEN_AGE_SECONDS"),

  databaseType: requireEnv("DATABASE_TYPE"),
  databaseHost: requireEnv("DATABASE_HOST"),
  databaseUser: requireEnv("DATABASE_USER"),
  databasePort: requireIntEnv("DATABASE_PORT"),
  databasePassword: requireEnv("DATABASE_PASSWORD"),
  databaseDatabaseName: requireEnv("DATABASE_DATABASE_NAME"),
});

export type Config = ReturnType<typeof getConfigFromEnv>;
