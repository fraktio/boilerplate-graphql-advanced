import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";

import { Logger } from "~/logger";

const requestHeader = "x-request-id";

export const loggerHandler =
  (params: { logger: Logger }): RequestHandler =>
  (req, res, next): void => {
    const requestID = { [requestHeader]: uuidv4() };
    res.setHeader(requestHeader, requestID[requestHeader]);

    // eslint-disable-next-line no-param-reassign
    req.logger = params.logger.child(requestID);

    res.on("finish", function responseSent() {
      params.logger.info(requestID, "end of request");
    });

    return next();
  };
