import { Language } from "~/generation/scalars";
import { toFailure, toSuccess, Try } from "~/utils/validation";
import { ValidationErrorFailure } from "~/validation/validationFailure";

export function validateLanguage(
  value: string,
): Try<Language, ValidationErrorFailure> {
  if (Object.keys(Language).includes(value)) {
    return toSuccess(value as unknown as Language);
  }

  return toFailure(new ValidationErrorFailure("Language", value));
}
