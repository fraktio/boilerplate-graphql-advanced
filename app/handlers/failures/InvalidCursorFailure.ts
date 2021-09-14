import { GeneralFailure } from "~/handlers/failures/GeneralFailure";

type FailureType = "InvalidCursorFailure";

export class InvalidCursorFailure extends GeneralFailure {
  public typename = "InvalidCursorFailure" as FailureType;
}
