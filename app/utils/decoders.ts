import * as t from "io-ts";

export const NumberFromString = new t.Type<number, string | number, unknown>(
  "NumberFromString",
  (u): u is number => typeof u === "number",
  (u, c) => {
    if (typeof u === "number" && !isNaN(u)) {
      return t.success(u);
    }

    if (typeof u === "string") {
      const parsed = parseInt(u, 10);
      if (!isNaN(parsed)) {
        return t.success(parsed);
      }
    }

    return t.failure(u, c);
  },
  (a: number) => a.toString(),
);

export const BooleanFromString = new t.Type<boolean, boolean | string, unknown>(
  "BooleanFromString",
  (u): u is boolean => typeof u === "boolean",
  (u, c) => {
    if (typeof u === "boolean") {
      return t.success(u);
    }

    if (typeof u === "string") {
      switch (u.toLowerCase()) {
        case "true":
          return t.success(true);

        case "false":
          return t.success(false);
      }
    }

    return t.failure(u, c);
  },
  (a: boolean) => `${a}`,
);
