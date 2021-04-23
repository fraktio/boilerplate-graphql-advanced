/* eslint-disable no-process-env */
import * as t from "io-ts";

export const NumberFactConfigDecoder = t.interface({
  token: t.string,
});

export type NumberFactConfig = t.TypeOf<typeof NumberFactConfigDecoder>;
