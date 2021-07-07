import * as t from "io-ts";

import { NumberFromString } from "~/utils/decoders";

export const CookiesConfigDecoder = t.type({
  path: t.string,
  domain: t.string,
  secret: t.string,
  accessTokenAgeSeconds: NumberFromString,
});

export type CookiesConfig = t.TypeOf<typeof CookiesConfigDecoder>;
