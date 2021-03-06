import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";

import { Phone } from "~/graphql/generation/scalarTypes";
import { validatePhone } from "~/utils/validation/converters";

const ERROR_MESSAGE =
  "Phone must be a valid a valid phone number in international format";

export const PhoneResolver = new GraphQLScalarType({
  name: "Phone",
  description: "Phone scalar type",

  serialize(value: Phone): string {
    return value.toString();
  },

  parseValue(value: string): Phone {
    const result = validatePhone(value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },

  parseLiteral(ast: ValueNode): Phone {
    if (ast.kind !== "StringValue") {
      throw new ValidationError(ERROR_MESSAGE);
    }
    const result = validatePhone(ast.value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },
});
