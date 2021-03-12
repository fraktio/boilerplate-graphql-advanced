import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";
import { PhoneNumber, parsePhoneNumber } from "libphonenumber-js";

const ERROR_MESSAGE =
  "Phone must be a valid a valid phone number in international format";

const formatDateToString = (phoneNumber: PhoneNumber) => {
  if (!phoneNumber.isValid()) {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return phoneNumber.formatInternational();
};

const parseDateFromString = (value: string): PhoneNumber => {
  const parsed = parsePhoneNumber(value);

  if (!parsed.isValid()) {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return parsed;
};

const parseLiteralPhoneNumber = (valueNode: ValueNode): PhoneNumber => {
  if (valueNode.kind !== "StringValue") {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return parseDateFromString(valueNode.value);
};

export const PhoneNumberResolver = new GraphQLScalarType({
  name: "Phone",
  description: "Phone scalar type",

  serialize: (value: PhoneNumber) => formatDateToString(value),
  parseValue: (value: string) => parseDateFromString(value),
  parseLiteral: (valueNode: ValueNode) => parseLiteralPhoneNumber(valueNode),
});
