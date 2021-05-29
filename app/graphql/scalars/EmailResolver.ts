import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";

import { EmailAddress } from "~/generation/scalars";
import { validateEmail } from "~/validation/validators/emailValidator";

const ERROR_MESSAGE = "Email must be a valid a valid emai address";

const formatEmailToString = (value: EmailAddress): string => value.toString();

const parseEmailFromString = (value: string): EmailAddress => {
  const result = validateEmail(value);
  if (result.success) {
    return result.value;
  }
  throw new ValidationError(ERROR_MESSAGE);
};

const parseLiteralEmail = (valueNode: ValueNode): EmailAddress => {
  if (valueNode.kind !== "StringValue") {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return parseEmailFromString(valueNode.value);
};

export const EmailResolver = new GraphQLScalarType({
  name: "Email",
  description: "Email custom scalar type",

  serialize: formatEmailToString,
  parseValue: parseEmailFromString,
  parseLiteral: parseLiteralEmail,
});
