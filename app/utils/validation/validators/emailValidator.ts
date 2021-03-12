import emailValidator from "email-validator";

import { toFailure, toSuccess, Try } from "../common";

import { Email } from "~/graphql/generation/scalarTypes";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

export function validateEmail(value: string): Try<Email, ValidationFailure> {
  if (emailValidator.validate(value)) {
    return toSuccess((value as unknown) as Email);
  }

  return toFailure(new ValidationFailure("Email", value));
}