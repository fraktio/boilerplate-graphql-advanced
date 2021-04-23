import { Maybe } from "graphql/jsutils/Maybe";
import { CountryCode as BaseCountryCode } from "libphonenumber-js";
import { DateTime } from "luxon";

export interface UUID extends String {
  _id: never;
}

export interface EmailAddress extends String {
  _email: never;
}

export interface FinnishPersonalIdentityCode extends String {
  _personalIdentityCode: never;
}

// eslint-disable-next-line no-shadow
export enum Language {
  EN = "EN",
  FI = "FI",
  SE = "SE",
}

export type CountryCode = BaseCountryCode;

export interface FinnishPostalCode extends String {
  _postalCode: never;
}

export interface FinnishMunicipality extends String {
  _municipality: never;
}

export type Timestamp = Readonly<{
  createdAt: DateTime;
  modifiedAt: Maybe<DateTime>;
}>;
