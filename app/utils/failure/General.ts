import { CustomError } from "ts-custom-error";

export class GeneralFailure extends CustomError {
  public constructor(public readonly field: string, message?: string) {
    super(message);
  }
}
