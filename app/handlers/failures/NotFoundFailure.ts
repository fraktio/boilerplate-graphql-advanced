import { GeneralFailure } from "~/handlers/failures/GeneralFailure";

type FailureType = "NotFoundFailure";

export class NotFoundFailure extends GeneralFailure {
  public typename = "NotFoundFailure" as FailureType;
}
