import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";
import * as t from "io-ts";

import { hashingUtils } from "~/utils/hashingUtils";

const ERROR_MESSAGE = "Cursor is not a valid cursor";

export const CursorDecoder = t.interface(
  {
    page: t.number,
    perPage: t.number,
    offset: t.number,
  },
  "cursorDecoder",
);

export type Cursor = t.TypeOf<typeof CursorDecoder>;

export const parseCursorFromString = (value: string): Cursor => {
  try {
    const decoded = hashingUtils.base64ToString(value);
    const cursor = JSON.parse(decoded);

    const validated = CursorDecoder.decode(cursor);
    if (validated._tag === "Left") {
      throw new ValidationError(ERROR_MESSAGE);
    }

    return cursor;
  } catch (e) {
    throw new ValidationError(ERROR_MESSAGE);
  }
};

export const cursorToString = (cursor: Cursor): string => {
  const cursorStr = JSON.stringify(cursor);

  return hashingUtils.stringToBase64(cursorStr);
};

const parseLiteralCursor = (valueNode: ValueNode): Cursor => {
  if (valueNode.kind !== "StringValue") {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return parseCursorFromString(valueNode.value);
};

export const CursorResolver = new GraphQLScalarType({
  name: "Cursor",
  description: "Cursor for pagination pages",

  serialize: cursorToString,
  parseValue: parseCursorFromString,
  parseLiteral: parseLiteralCursor,
});
