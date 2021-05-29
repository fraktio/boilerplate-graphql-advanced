import emailValidator from "email-validator";

import { ValidationErrorFailure } from "../validationFailure";

import { EmailAddress } from "~/generation/scalars";
import { toFailure, toSuccess, Try } from "~/utils/validation";

export function validateEmail(
  value: string,
): Try<EmailAddress, ValidationErrorFailure> {
  if (emailValidator.validate(value)) {
    return toSuccess(value as unknown as EmailAddress);
  }

  return toFailure(new ValidationErrorFailure("Email", value));
}
