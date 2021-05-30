import type Bunyan from "bunyan";

import { UserTable } from "~/database/user/userQueries";

declare global {
  namespace Express {
    interface Request {
      logger: Bunyan;
      user?: UserTable;
    }
  }
}
