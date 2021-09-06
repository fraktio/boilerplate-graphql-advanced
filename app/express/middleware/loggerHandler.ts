import { LOGGING_TRACE_KEY } from "@google-cloud/logging-bunyan";
import { RequestHandler, Request } from "express";
import { v4 as uuidv4 } from "uuid";

import {
  Platform,
  PlatformConfig,
  PlatformGoogleCloudConfig,
} from "~/config/configs/platformConfig";
import { Logger } from "~/logger";

type TraceResponse = { traceId: string };
type TraceHandler = (params: { req: Request }) => TraceResponse;
type CreateResolverResponse = {
  getTraceId: TraceHandler;
  TRACE_KEY_NAME: string;
};

const createGoogleCloudPlatformTrace =
  (params: { platformConfig: PlatformGoogleCloudConfig }): TraceHandler =>
  ({ req }): TraceResponse => {
    const traceId = req.header("X-Cloud-Trace-Context");

    return {
      traceId: traceId
        ? `projects/${params.platformConfig.projectId}/traces/${traceId}`
        : uuidv4(),
    };
  };

const createDefaultTrace = (): TraceHandler => (): TraceResponse => ({
  traceId: uuidv4(),
});

const createTraceIdResolver = (params: {
  platformConfig: PlatformConfig;
}): CreateResolverResponse => {
  switch (params.platformConfig.type) {
    case Platform.GoogleCloudPlatform:
      return {
        getTraceId: createGoogleCloudPlatformTrace({
          platformConfig: params.platformConfig,
        }),
        TRACE_KEY_NAME: LOGGING_TRACE_KEY,
      };

    case Platform.Local:
    default:
      return {
        getTraceId: createDefaultTrace(),
        TRACE_KEY_NAME: "x-trace-id",
      };
  }
};

export const createLoggerMiddleware = (params: {
  logger: Logger;
  platformConfig: PlatformConfig;
}): RequestHandler => {
  const { getTraceId, TRACE_KEY_NAME } = createTraceIdResolver({
    platformConfig: params.platformConfig,
  });

  return (req, res, next): void => {
    const { traceId } = getTraceId({ req });
    const requestTrace = {
      [TRACE_KEY_NAME]: traceId,
      requestId: uuidv4(),
      userUUID: req.user?.UUID,
    };

    const childLogger = params.logger.child(requestTrace);
    // eslint-disable-next-line no-param-reassign
    req.logger = childLogger;

    childLogger.info("start of request");
    res.on("finish", function responseSent() {
      req.logger.info("end of request");
    });

    next();
  };
};
