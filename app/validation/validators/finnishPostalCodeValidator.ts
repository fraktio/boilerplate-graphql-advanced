import { FinnishPostalCode } from "~/generation/scalars";
import { toFailure, toSuccess, Try } from "~/utils/validation";
import { ValidationErrorFailure } from "~/validation/validationFailure";

export function validateFinnishPostalCode(
  value: string,
): Try<FinnishPostalCode, ValidationErrorFailure> {
  if (/^\d{5}$/.test(value)) {
    return toSuccess(value as unknown as FinnishPostalCode);
  }

  return toFailure(new ValidationErrorFailure("PostalCode", value));
}
