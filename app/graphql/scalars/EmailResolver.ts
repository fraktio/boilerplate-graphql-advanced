import { ValidationError } from "apollo-server-express";
import emailValidator from "email-validator";
import { GraphQLScalarType, ValueNode } from "graphql";

import { EmailAddress } from "~/generation/scalars";

const ERROR_MESSAGE = "Email must be a valid a valid emai address";

const formatEmailToString = (value: EmailAddress): string => value.toString();

const parseEmailFromString = (value: string): EmailAddress => {
  if (!emailValidator.validate(value)) {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return (value as unknown) as EmailAddress;
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

  serialize: (value: EmailAddress) => formatEmailToString(value),
  parseValue: (value: string) => parseEmailFromString(value),
  parseLiteral: (valueNode: ValueNode) => parseLiteralEmail(valueNode),
});
