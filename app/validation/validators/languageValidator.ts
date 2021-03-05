import { toFailure, toSuccess } from "../common";

import { Try } from "~/@types/global";
import { Language } from "~/@types/scalarTypes";
import { ValidationFailure } from "~/utils/failure/ValidationFailure";

export function validateLanguage(
  value: string,
): Try<Language, ValidationFailure> {
  if (Object.keys(Language).includes(value)) {
    return toSuccess((value as unknown) as Language);
  }

  return toFailure(new ValidationFailure("Language", value));
}
