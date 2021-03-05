import { Failure, Success, Try } from "~/@types/global";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

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
