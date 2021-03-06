import { FinnishSSN } from "finnish-ssn";

import { toFailure, toSuccess, Try } from "../common";

import { FinnishPersonalIdentityCode } from "~/graphql/generation/scalarTypes";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

export function validateFinnishPersonalIdentityCode(
  value: string,
): Try<FinnishPersonalIdentityCode, ValidationFailure> {
  if (FinnishSSN.validate(value)) {
    return toSuccess((value as unknown) as FinnishPersonalIdentityCode);
  }

  return toFailure(new ValidationFailure("PersonalIdentityCode", value));
}
