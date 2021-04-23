import { PhoneNumber } from "libphonenumber-js";
import { DateTime } from "luxon";

import { validateCountryCode } from "./validators/countryCodeValidator";
import { validateEmail } from "./validators/emailValidator";
import { validateFinnishMunicipality } from "./validators/finnishMunicipalityValidator";
import { validateFinnishPersonalIdentityCode } from "./validators/finnishPersonalIdentityCodeValidator";
import { validateFinnishPostalCode } from "./validators/finnishPostalCodeValidator";
import { validateLanguage } from "./validators/languageValidator";
import { validatePhoneNumber } from "./validators/phoneNumberValidator";

import { Timestamp } from "~/generation/generated";
import {
  CountryCode,
  EmailAddress,
  UUID,
  Language,
  FinnishPostalCode,
  FinnishMunicipality,
  FinnishPersonalIdentityCode,
} from "~/generation/scalars";
import { trySuccess } from "~/utils/validation";

export function asCountryCode(value: string): CountryCode {
  return trySuccess(validateCountryCode(value));
}

export function asEmail(value: string): EmailAddress {
  return trySuccess(validateEmail(value));
}

export function asUUID(value: string): UUID {
  return (String(value) as unknown) as UUID;
}

export function asLanguage(value: string): Language {
  return trySuccess(validateLanguage(value));
}

export function asFinnishPersonalIdentityCode(
  value: string,
): FinnishPersonalIdentityCode {
  return trySuccess(validateFinnishPersonalIdentityCode(value));
}

export function asPhoneNumber(value: string): PhoneNumber {
  return trySuccess(validatePhoneNumber(value));
}

export function asFinnishPostalCode(value: string): FinnishPostalCode {
  return trySuccess(validateFinnishPostalCode(value));
}

export function asFinnishMunicipality(value: string): FinnishMunicipality {
  return trySuccess(validateFinnishMunicipality(value));
}

export function asTimestamp(
  createdAt: DateTime,
  modifiedAt: DateTime,
): Timestamp {
  return {
    createdAt,
    modifiedAt,
  };
}
