import type Bunyan from "bunyan";

import { PersonTable } from "~/database/person/personDatabase";

declare global {
  namespace Express {
    interface Request {
      logger: Bunyan;
      user?: PersonTable;
    }
  }
}
