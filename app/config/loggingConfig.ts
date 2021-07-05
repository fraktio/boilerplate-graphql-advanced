import fs from "fs";
import * as t from "io-ts";

import { BooleanFromString } from "~/utils/decoders";

export const LoggingConfigDecoder = t.interface({
  stdoutLogging: BooleanFromString,
  version: t.string,
  name: t.string,
});

export type LoggingConfig = t.TypeOf<typeof LoggingConfigDecoder>;

type Package = {
  name: string;
  version: string;
};

const getPackage = (): Package => {
  try {
    return JSON.parse(fs.readFileSync("package.json", "utf8")) as Package;
  } catch (e) {
    throw new Error(
      "package.json is needed is the root directory. package.json was not found",
    );
  }
};

const packageInfo = getPackage();

export const getPackageVersion = (): string => packageInfo.version;

export const getPackageName = (): string => packageInfo.name;
