import { PhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js";

import { ValidationErrorFailure } from "../validationFailure";

import { toFailure, toSuccess, Try } from "~/utils/validation";

export function validatePhoneNumber(
  value: string,
): Try<PhoneNumber, ValidationErrorFailure> {
  const parsed = parsePhoneNumberFromString(value, "FI");

  if (parsed && parsed.isValid() && parsed.number === value) {
    return toSuccess((value as unknown) as PhoneNumber);
  }

  return toFailure(new ValidationErrorFailure("Phone", value));
}
