import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import { DateTime } from "luxon";

export const parseDateTimeFromString = (value: string) => {
  const date = DateTime.fromISO(value);

  if (!date.isValid) {
    throw new ValidationError(`${value} is not a valid date`);
  }

  return date;
};

export const formatDateTimeToString = (dateTime: DateTime) => {
  if (!dateTime.isValid) {
    throw new ValidationError(`${dateTime.toString()} is not a valid date`);
  }

  return dateTime.toISO();
};

export const DateTimeResolver = new GraphQLScalarType({
  name: "DateTime",
  description: "Date and time with offset",
  parseValue: (value: string) => parseDateTimeFromString(value),
  serialize: (date: DateTime) => formatDateTimeToString(date),
});
