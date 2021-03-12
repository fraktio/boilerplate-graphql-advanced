import { DateTime } from "luxon";

import { trySuccess } from "./common";
import { validateCountryCode } from "./validators/countryCodeValdator";
import { validateEmail } from "./validators/emailValidator";
import { validateFinnishMunicipality } from "./validators/finnishMunicipalityValidator";
import { validateFinnishPersonalIdentityCode } from "./validators/finnishPersonalIdentityCodeValidator";
import { validateFinnishPostalCode } from "./validators/finnishPostalCodeValidator";
import { validateLanguage } from "./validators/languageValidator";
import { validatePhone } from "./validators/phoneValidator";

import { ID } from "~/database/tables";
import { Timestamp } from "~/generation/generated";
import { UUID } from "~/generation/mappers";
import {
  CountryCode,
  Email,
  Language,
  FinnishPersonalIdentityCode,
  Phone,
  FinnishPostalCode,
  FinnishMunicipality,
} from "~/generation/scalars";

export function asCountryCode(value: string): CountryCode {
  return trySuccess(validateCountryCode(value));
}
export function asEmail(value: string): Email {
  return trySuccess(validateEmail(value));
}

export function asId(value: number): ID {
  return (Number(value) as unknown) as ID;
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

export function asPhone(value: string): Phone {
  return trySuccess(validatePhone(value));
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

export {
  validateCountryCode,
  validateEmail,
  validateLanguage,
  validateFinnishMunicipality,
  validateFinnishPersonalIdentityCode,
  validatePhone,
  validateFinnishPostalCode,
};
