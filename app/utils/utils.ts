import { Logger } from "knex";

import { Config } from "~/config";
import { HashingUtils } from "~/utils/hashingUtils";
import { SessionUtils } from "~/utils/sessionUtils";

export type Utils = {
  hashingUtils: HashingUtils;
  sessionUtils: SessionUtils;
};

export const createUtils = (opts: {
  config: Config;
  logger: Logger;
}): Utils => {
  const hashingUtils = new HashingUtils();
  const sessionUtils = new SessionUtils({ config: opts.config });

  return {
    hashingUtils,
    sessionUtils,
  };
};
