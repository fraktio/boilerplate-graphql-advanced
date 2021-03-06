import { FailureObject } from "~/utils/failure";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

export type Try<T, F extends FailureObject> = Success<T> | Failure<F>;

export type Success<T> = Readonly<{
  value: T;
  success: true;
}>;

export type Failure<F> = Readonly<{
  failure: F;
  success: false;
}>;

export function trySuccess<T, E extends ValidationFailure>(
  result: Try<T, E>,
): T {
  if (result.success) {
    return result.value;
  }

  throw result.failure;
}

export function toSuccess<T>(value: T): Success<T> {
  return {
    success: true,
    value,
  };
}

export function toFailure<F>(failure: F): Failure<F> {
  return {
    failure,
    success: false,
  };
}
