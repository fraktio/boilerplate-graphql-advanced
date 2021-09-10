import type Bunyan from "bunyan";

import { UserTable } from "~/database/user/userQueries";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      logger: Bunyan;
      user?: UserTable;
    }
  }
}

export type ValueOf<T> = T[keyof T];

export type Maybe<T> = null | undefined | T;
