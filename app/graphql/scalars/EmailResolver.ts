import { ValidationError } from "apollo-server-express";
import emailValidator from "email-validator";
import { GraphQLScalarType, ValueNode } from "graphql";

import { Email } from "~/generation/scalars";

const ERROR_MESSAGE = "Email must be a valid a valid emai address";

const formatEmailToString = (value: Email): string => value.toString();

const parseEmailFromString = (value: string): Email => {
  if (!emailValidator.validate(value)) {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return (value as unknown) as Email;
};

const parseLiteralEmail = (valueNode: ValueNode): Email => {
  if (valueNode.kind !== "StringValue") {
    throw new ValidationError(ERROR_MESSAGE);
  }

  return parseEmailFromString(valueNode.value);
};

export const EmailResolver = new GraphQLScalarType({
  name: "Email",
  description: "Email custom scalar type",

  serialize: (value: Email) => formatEmailToString(value),
  parseValue: (value: string) => parseEmailFromString(value),
  parseLiteral: (valueNode: ValueNode) => parseLiteralEmail(valueNode),
});
