import { Maybe } from "graphql/jsutils/Maybe";
import { Iso3166Alpha2Code } from "iso-3166-ts";
import { DateTime } from "luxon";

import { UUID as GeneratedUUID } from "~/generation/mappers";
import { Cursor as CursorResolverCursor } from "~/graphql/scalars/CursorResolver";

export type UUID = GeneratedUUID;

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

export type CountryCode = Iso3166Alpha2Code;

export interface FinnishPostalCode extends String {
  _postalCode: never;
}

export interface FinnishMunicipality extends String {
  _municipality: never;
}

export type Cursor = CursorResolverCursor;

export type Timestamp = Readonly<{
  createdAt: DateTime;
  modifiedAt: Maybe<DateTime>;
}>;
