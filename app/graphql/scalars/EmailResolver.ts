import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";

import { Email } from "~/generation/scalars";
import { validateEmail } from "~/utils/validation/converters";

const ERROR_MESSAGE = "Email must be a valid a valid emai address";

export const EmailResolver = new GraphQLScalarType({
  description: "Email custom scalar type",
  name: "Email",

  serialize(value: Email): string {
    return value.toString();
  },

  parseValue(value: string): Email {
    const result = validateEmail(value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },

  parseLiteral(ast: ValueNode): Email {
    if (ast.kind !== "StringValue") {
      throw new ValidationError(ERROR_MESSAGE);
    }
    const result = validateEmail(ast.value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },
});
