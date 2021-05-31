import { PhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js";

import { toFailure, toSuccess, Try } from "~/utils/validation";
import { ValidationErrorFailure } from "~/validation/validationFailure";

export function validatePhoneNumber(
  value: string,
): Try<PhoneNumber, ValidationErrorFailure> {
  const parsed = parsePhoneNumberFromString(value, "FI");

  if (parsed && parsed.isValid()) {
    return toSuccess(parsed as unknown as PhoneNumber);
  }

  return toFailure(new ValidationErrorFailure("Phone", value));
}
