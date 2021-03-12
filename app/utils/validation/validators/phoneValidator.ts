import { parsePhoneNumberFromString } from "libphonenumber-js";

import { toFailure, toSuccess, Try } from "../common";

import { Phone } from "~/generation/scalars";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

export function validatePhone(value: string): Try<Phone, ValidationFailure> {
  const parsed = parsePhoneNumberFromString(value, "FI");

  if (parsed && parsed.isValid() && parsed.number === value) {
    return toSuccess((value as unknown) as Phone);
  }

  return toFailure(new ValidationFailure("Phone", value));
}
