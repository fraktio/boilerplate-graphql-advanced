import { GeneralFailure } from "./General";

export class ValidationFailure extends GeneralFailure {
  public constructor(
    public readonly type: string,
    public readonly value: unknown,
    public readonly message: string = `Validation failed for type "${type}", value: ${JSON.stringify(
      value,
    )} (${typeof value})`,
  ) {
    super(message);
  }
}
