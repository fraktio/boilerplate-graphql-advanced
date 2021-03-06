import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import { DateTime } from "luxon";

export const parseDateFromString = (value: string) => {
  const date = DateTime.fromFormat(value, "yyyy-MM-dd", { zone: "utc" });

  if (!date.isValid) {
    throw new ValidationError(`${value} is not a valid date`);
  }

  return date;
};

export const formatDateToString = (dateTime: DateTime) => {
  if (!dateTime.isValid) {
    throw new ValidationError(`${dateTime.toString()} is not a valid date`);
  }

  return dateTime.toFormat("yyyy-MM-dd");
};

export const DateResolver = new GraphQLScalarType({
  name: "Date",
  description: "Date without time or timezone",
  parseValue: (value: string) => parseDateFromString(value),
  serialize: (date: DateTime) => formatDateToString(date),
});
