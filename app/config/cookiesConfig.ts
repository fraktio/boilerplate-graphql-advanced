/* eslint-disable no-process-env */
import * as t from "io-ts";

import { NumberFromString } from "../utils/decoders";

export const CookiesConfigDecoder = t.type({
  path: t.string,
  domain: t.string,
  secret: t.string,
  accessAgeSeconds: NumberFromString,
  refreshAgeSeconds: NumberFromString,
});

export type CookiesConfig = t.TypeOf<typeof CookiesConfigDecoder>;
