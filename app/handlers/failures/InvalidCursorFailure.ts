import { GeneralFailure } from "~/handlers/failures/GeneralFailure";

export class InvalidCursorFailure extends GeneralFailure {
  __typename!: "InvalidCursorFailure";
}
