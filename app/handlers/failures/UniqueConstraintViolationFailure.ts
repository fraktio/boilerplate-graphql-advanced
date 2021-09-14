import { GeneralFailure } from "~/handlers/failures/GeneralFailure";

type FailureType = "UniqueConstraintViolationFailure";

export class UniqueConstraintViolationFailure extends GeneralFailure {
  public typename = "UniqueConstraintViolationFailure" as FailureType;
}
