export type Success<T> = Readonly<{
  value: T;
  success: true;
}>;

export type Failure<F> = Readonly<{
  failure: F;
  success: false;
}>;

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
