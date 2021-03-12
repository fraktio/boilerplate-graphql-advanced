import { toFailure, toSuccess, Try } from "../common";

import { Language } from "~/generation/scalars";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

export function validateLanguage(
  value: string,
): Try<Language, ValidationFailure> {
  if (Object.keys(Language).includes(value)) {
    return toSuccess((value as unknown) as Language);
  }

  return toFailure(new ValidationFailure("Language", value));
}
