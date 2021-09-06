import {
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_SQL_CONNECTION_NAME,
  PLATFORM,
} from "~/config/envNames";
import { getEnv } from "~/config/getters";

export enum Platform {
  Local = "local",
  GoogleCloudPlatform = "google-cloud-platform",
  AWS = "aws",
}

const acceptedValues = Object.values(Platform);

export type PlatformLocalConfig = {
  type: Platform.Local;
};

export type PlatformAwsConfig = {
  type: Platform.AWS;
};

export type PlatformGoogleCloudConfig = {
  type: Platform.GoogleCloudPlatform;
  sqlConnectionName: string;
  projectId: string;
};

export type PlatformConfig =
  | PlatformLocalConfig
  | PlatformAwsConfig
  | PlatformGoogleCloudConfig;

export const createPlatformConfig = (): PlatformConfig => {
  const type = getEnv(PLATFORM, acceptedValues);

  switch (type) {
    case Platform.GoogleCloudPlatform:
      return {
        type,
        sqlConnectionName: getEnv(GOOGLE_CLOUD_SQL_CONNECTION_NAME),
        projectId: getEnv(GOOGLE_CLOUD_PROJECT_ID),
      };

    case Platform.AWS:
    case Platform.Local:
    default:
      return {
        type,
      };
  }
};
