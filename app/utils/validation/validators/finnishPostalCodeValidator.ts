import { toFailure, toSuccess, Try } from "../common";

import { FinnishPostalCode } from "~/generation/scalars";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

export function validateFinnishPostalCode(
  value: string,
): Try<FinnishPostalCode, ValidationFailure> {
  if (/^\d{5}$/.test(value)) {
    return toSuccess((value as unknown) as FinnishPostalCode);
  }

  return toFailure(new ValidationFailure("PostalCode", value));
}
