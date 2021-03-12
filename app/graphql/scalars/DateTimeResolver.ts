import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";
import { DateTime } from "luxon";

const ERROR_MESSAGE = "Datetime is not a valid date";

export const parseDateTimeFromString = (value: string) => {
  const date = DateTime.fromISO(value);

  if (!date.isValid) {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return date;
};

export const formatDateTimeToString = (dateTime: DateTime) => {
  if (!dateTime.isValid) {
    throw new ValidationError(`${dateTime.toString()} is not a valid date`);
  }

  return dateTime.toISO();
};

const parseLiteralDateTime = (valueNode: ValueNode): DateTime => {
  if (valueNode.kind !== "StringValue") {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return parseDateTimeFromString(valueNode.value);
};

export const DateTimeResolver = new GraphQLScalarType({
  name: "DateTime",
  description: "Date and time with offset",

  serialize: (date: DateTime) => formatDateTimeToString(date),
  parseValue: (value: string) => parseDateTimeFromString(value),
  parseLiteral: (valueNode: ValueNode) => parseLiteralDateTime(valueNode),
});
