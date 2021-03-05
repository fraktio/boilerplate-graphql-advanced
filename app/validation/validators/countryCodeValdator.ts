import { toFailure, toSuccess } from "../common";

import { Try } from "~/@types/global";
import { CountryCode } from "~/@types/scalarTypes";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

export function validateCountryCode(
  value: string,
): Try<CountryCode, ValidationFailure> {
  if (Object.keys(CountryCode).includes(value)) {
    return toSuccess((value as unknown) as CountryCode);
  }

  return toFailure(new ValidationFailure("CountryCode", value));
}
