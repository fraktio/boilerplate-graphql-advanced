import { toFailure, toSuccess } from "../common";

import { Try } from "~/@types/global";
import { FinnishPostalCode } from "~/@types/scalarTypes";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

export function validateFinnishPostalCode(
  value: string,
): Try<FinnishPostalCode, ValidationFailure> {
  if (/^\d{5}$/.test(value)) {
    return toSuccess((value as unknown) as FinnishPostalCode);
  }

  return toFailure(new ValidationFailure("PostalCode", value));
}
