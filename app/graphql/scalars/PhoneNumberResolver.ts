import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";
import { PhoneNumber } from "libphonenumber-js";

import { validatePhoneNumber } from "~/validation/validators/phoneNumberValidator";

const ERROR_MESSAGE =
  "Phone must be a valid a valid phone number in international format";

const formatDateToString = (phoneNumber: PhoneNumber): string => {
  if (!phoneNumber.isValid()) {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return phoneNumber.formatInternational();
};

const parseDateFromString = (value: string): PhoneNumber => {
  const result = validatePhoneNumber(value);

  if (result.success) {
    return result.value;
  }
  throw new ValidationError(ERROR_MESSAGE);
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

  serialize: formatDateToString,
  parseValue: parseDateFromString,
  parseLiteral: parseLiteralPhoneNumber,
});
