import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";
import { DateTime } from "luxon";

const ERROR_MESSAGE = "Date is not a valid date format yyyy-MM-dd";

export const parseDateFromString = (value: string) => {
  const date = DateTime.fromFormat(value, "yyyy-MM-dd", { zone: "utc" });

  if (!date.isValid) {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return date;
};

export const formatDateToString = (dateTime: DateTime) => {
  if (!dateTime.isValid) {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return dateTime.toFormat("yyyy-MM-dd");
};

const parseLiteralDate = (valueNode: ValueNode): DateTime => {
  if (valueNode.kind !== "StringValue") {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return parseDateFromString(valueNode.value);
};

export const DateResolver = new GraphQLScalarType({
  name: "Date",
  description: "Date without time or timezone",

  serialize: (date: DateTime) => formatDateToString(date),
  parseValue: (value: string) => parseDateFromString(value),
  parseLiteral: (valueNode: ValueNode) => parseLiteralDate(valueNode),
});
