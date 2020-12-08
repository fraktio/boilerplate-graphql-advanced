import type Bunyan from "bunyan";

import { UUID } from "~/models";

declare global {
  namespace Express {
    interface Request {
      logger: Bunyan;
      user?: {
        uuid: UUID;
      };
    }
  }
}
