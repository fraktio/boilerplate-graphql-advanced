import SSM from "aws-sdk/clients/ssm";

import { Config, validateConfig } from "./config";
import {
  ACCESS_TOKEN_AGE_SECONDS,
  API_CORS_ENDPOINT,
  API_PORT,
  DATABASE_DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
  NUMBER_API_MOCK_TOKEN,
  PRODUCTION,
  REFRESH_TOKEN_AGE_SECONDS,
  STDOUT_LOGGING,
  TOKEN_DOMAIN,
  TOKEN_PATH,
  TOKEN_SECRET,
  getEnv,
} from "./variablesConfig";

const getParams = async (ssm: SSM): Promise<SSM.ParameterList> => {
  try {
    const data = await ssm
      .getParameters({
        Names: [TOKEN_SECRET, DATABASE_PASSWORD, NUMBER_API_MOCK_TOKEN],
      })
      .promise();

    if (data.InvalidParameters?.length !== 0) {
      throw new Error(data.InvalidParameters?.toString());
    }

    if (!Array.isArray(data.Parameters)) {
      throw new Error("AWS SSM response was not an array");
    }

    return data.Parameters;
  } catch (e) {
    throw new Error(e);
  }
};

export const createServerlessConfig = async (): Promise<Config> => {
  // eslint-disable-next-line no-process-env
  const ssm = new SSM({ region: process.env.AWS_REGION });

  const params = await getParams(ssm);

  const getParam = (name: string): string | null => {
    const param = params.find((p) => p.Name === name);

    return param?.Value ?? null;
  };

  const config = {
    env: {
      apiPort: getEnv(API_PORT),
      stdoutLogging: getEnv(STDOUT_LOGGING),
      isProduction: getEnv(PRODUCTION),
      apiCorsEndpoint: getEnv(API_CORS_ENDPOINT),
    },

    cookies: {
      path: getEnv(TOKEN_PATH),
      domain: getEnv(TOKEN_DOMAIN),
      secret: getParam(TOKEN_SECRET),
      accessAgeSeconds: getEnv(ACCESS_TOKEN_AGE_SECONDS),
      refreshAgeSeconds: getEnv(REFRESH_TOKEN_AGE_SECONDS),
    },

    database: {
      type: getEnv(DATABASE_TYPE),
      host: getEnv(DATABASE_HOST),
      user: getEnv(DATABASE_USER),
      port: getEnv(DATABASE_PORT),
      password: getParam(DATABASE_PASSWORD),
      databaseName: getEnv(DATABASE_DATABASE_NAME),
    },

    numberFact: {
      token: getParam(NUMBER_API_MOCK_TOKEN),
    },
  };

  return validateConfig(config);
};
