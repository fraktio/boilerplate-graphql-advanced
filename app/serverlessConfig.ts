import SSM from "aws-sdk/clients/ssm";

// File has to be at the root level of the api

import {
  Config,
  API_PORT,
  STDOUT_LOGGING,
  PRODUCTION,
  API_CORS_ENDPOINT,
  TOKEN_PATH,
  TOKEN_DOMAIN,
  TOKEN_SECRET,
  ACCESS_TOKEN_AGE_SECONDS,
  REFRESH_TOKEN_AGE_SECONDS,
  DATABASE_TYPE,
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PORT,
  DATABASE_PASSWORD,
  DATABASE_DATABASE_NAME,
  NUMBER_API_MOCK_TOKEN,
} from "~/config";

export const getConfig = async (): Promise<Config> => {
  // eslint-disable-next-line no-process-env
  const ssm = new SSM({ region: process.env.AWS_REGION });

  const getParam = async (param: string) => {
    try {
      const data = await ssm.getParameter({ Name: param }).promise();

      return data ?? null;
    } catch (e) {
      return null;
    }
  };

  const requireEnv = async (env: string): Promise<string> => {
    const data = await getParam(env);

    if (!data?.Parameter?.Value) {
      throw new Error(`Environment variable ${env} is missing!`);
    }

    return data.Parameter.Value;
  };

  const requireIntEnv = async (env: string): Promise<number> => {
    const value = await requireEnv(env);

    const parsed = parseInt(value, 10);

    if (!parsed || isNaN(parsed)) {
      throw new Error(`Environment variable ${env} is not a valid number!`);
    }

    return parsed;
  };

  const requireBoolean = async (env: string): Promise<boolean> => {
    const value = await requireEnv(env);

    if (value === "TRUE") {
      return true;
    }

    if (value === "FALSE") {
      return false;
    }

    throw new Error(
      `Environment variable ${env} only accepts 'TRUE' or 'FALSE'!`,
    );
  };

  return {
    apiPort: await requireIntEnv(API_PORT),
    stdoutLogging: await requireBoolean(STDOUT_LOGGING),
    isProduction: await requireBoolean(PRODUCTION),
    apiCorsEndpoint: await requireEnv(API_CORS_ENDPOINT),

    cookies: {
      path: await requireEnv(TOKEN_PATH),
      domain: await requireEnv(TOKEN_DOMAIN),
      secret: await requireEnv(TOKEN_SECRET),
      accessAgeSeconds: await requireIntEnv(ACCESS_TOKEN_AGE_SECONDS),
      refreshAgeSeconds: await requireIntEnv(REFRESH_TOKEN_AGE_SECONDS),
    },

    database: {
      type: await requireEnv(DATABASE_TYPE),
      host: await requireEnv(DATABASE_HOST),
      user: await requireEnv(DATABASE_USER),
      port: await requireIntEnv(DATABASE_PORT),
      password: await requireEnv(DATABASE_PASSWORD),
      databaseName: await requireEnv(DATABASE_DATABASE_NAME),
    },

    numberFact: {
      token: await requireEnv(NUMBER_API_MOCK_TOKEN),
    },
  };
};
