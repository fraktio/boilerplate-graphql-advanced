import { Try } from "~/utils/validation";

export class ValidationErrorFailure extends Error {
  public constructor(
    public readonly type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly value: any,
    public readonly message: string = `Validation error for type "${type}", value: ${JSON.stringify(
      value,
    )} (${typeof value})`,
  ) {
    super(message);
  }
}

export function tryValidationSuccess<T, E extends ValidationErrorFailure>(
  result: Try<T, E>,
): T {
  if (result.success) {
    return result.value;
  }

  throw result.failure;
}
