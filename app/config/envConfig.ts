import * as t from "io-ts";

import { BooleanFromString, NumberFromString } from "~/utils/decoders";

export const EnvConfigDecoder = t.type({
  apiPort: NumberFromString,
  isProduction: BooleanFromString,
  apiCorsEndpoint: t.string,
});

export type EnvConfig = t.TypeOf<typeof EnvConfigDecoder>;
