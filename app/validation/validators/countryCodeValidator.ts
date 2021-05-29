import { ISO_3166_ALPHA_2 } from "iso-3166-ts";

import { ValidationErrorFailure } from "../validationFailure";

import { CountryCode } from "~/generation/scalars";
import { toFailure, toSuccess, Try } from "~/utils/validation";

export function validateCountryCode(
  value: string,
): Try<CountryCode, ValidationErrorFailure> {
  const code = value as unknown as CountryCode;

  if (ISO_3166_ALPHA_2.includes(code)) {
    return toSuccess(code);
  }

  return toFailure(new ValidationErrorFailure("CountryCode", value));
}
