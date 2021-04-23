import { ValidationErrorFailure } from "../validationFailure";

import { CountryCode } from "~/generation/scalars";
import { toFailure, toSuccess, Try } from "~/utils/validation";

export function validateCountryCode(
  value: string,
): Try<CountryCode, ValidationErrorFailure> {
  if (Object.keys(CountryCode).includes(value)) {
    return toSuccess((value as unknown) as CountryCode);
  }

  return toFailure(new ValidationErrorFailure("CountryCode", value));
}
