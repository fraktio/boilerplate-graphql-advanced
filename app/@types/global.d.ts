import type Bunyan from "bunyan";

import { PersonTable } from "~/dataSources/person/personDatabase";
import { FailureObject } from "~/utils/failure";

declare global {
  namespace Express {
    interface Request {
      logger: Bunyan;
      user?: PersonTable;
    }
  }
}

export type Try<T, F extends FailureObject> = Success<T> | Failure<F>;

export type Success<T> = Readonly<{
  value: T;
  success: true;
}>;

export type Failure<F> = Readonly<{
  failure: F;
  success: false;
}>;
