import { GeneralFailure } from "~/handlers/failures/GeneralFailure";

export class NotFoundFailure extends GeneralFailure {
  __typename!: "NotFoundFailure";
}
