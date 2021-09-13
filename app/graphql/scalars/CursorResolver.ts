import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";

import { UUID } from "~/generation/scalars";
import { hashingUtils } from "~/utils/hashingUtils";
import { asUUID } from "~/validation/converters";

const ERROR_MESSAGE = "Cursor is not a valid cursor";
const ERROR_MESSAGE_EMPTY =
  "Cursor is not a valid cursor, cursor cannot be empty";

export type RawCursor = { queryCursor: string };

export type Cursor = {
  queryCursor: UUID;
};

export const parseCursorFromString = (value: string): Cursor => {
  const raw = parseRawCursorFromString(value);

  return {
    ...raw,
    queryCursor: asUUID(raw.queryCursor),
  };
};

export const parseRawCursorFromString = (value: string): RawCursor => {
  try {
    const decoded = hashingUtils.base64ToString(value);
    const cursor = JSON.parse(decoded);

    if (typeof cursor.queryCursor !== "string") {
      throw new ValidationError(ERROR_MESSAGE);
    }

    if (cursor.queryCursor === "") {
      throw new ValidationError(ERROR_MESSAGE_EMPTY);
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
