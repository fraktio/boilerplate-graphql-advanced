import { GeneralFailure } from "~/handlers/failures/GeneralFailure";

export class UniqueConstraintViolationFailure extends GeneralFailure {
  __typename!: "UniqueConstraintViolationFailure";
}
