import { Logger } from "knex";

import { ResponseService } from "./responseService";

import { Config } from "~/config";
import { HashingService } from "~/services/hashingService";
import { SessionService } from "~/services/sessionService";

export type Services = {
  hashingService: HashingService;
  sessionService: SessionService;
  responseService: ResponseService;
};

export const createServices = (opts: {
  config: Config;
  logger: Logger;
}): Services => {
  const hashingService = new HashingService();
  const sessionService = new SessionService({ config: opts.config });
  const responseService = new ResponseService();

  return {
    hashingService,
    sessionService,
    responseService,
  };
};
