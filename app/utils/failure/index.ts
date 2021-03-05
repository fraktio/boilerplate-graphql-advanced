import { InvalidDateRangeFailure } from "./InvalidDateRangeFailure";
import { InvalidStateFailure } from "./InvalidStateFailure";
import { UniqueConstraintViolationFailure } from "./UniqueConstraintViolationFailure";
import { ValidationFailure } from "./ValidationFailure";

export type FailureObject =
  | InvalidDateRangeFailure
  | UniqueConstraintViolationFailure
  | ValidationFailure
  | InvalidStateFailure;

export {
  InvalidDateRangeFailure,
  UniqueConstraintViolationFailure,
  InvalidStateFailure,
  ValidationFailure,
};
