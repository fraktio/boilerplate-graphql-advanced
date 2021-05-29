import { FinnishSSN } from "finnish-ssn";

import { ValidationErrorFailure } from "../validationFailure";

import { FinnishPersonalIdentityCode } from "~/generation/scalars";
import { toFailure, toSuccess, Try } from "~/utils/validation";

export function validateFinnishPersonalIdentityCode(
  value: string,
): Try<FinnishPersonalIdentityCode, ValidationErrorFailure> {
  if (FinnishSSN.validate(value)) {
    return toSuccess(value as unknown as FinnishPersonalIdentityCode);
  }

  return toFailure(new ValidationErrorFailure("PersonalIdentityCode", value));
}
