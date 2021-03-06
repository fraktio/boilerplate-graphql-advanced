import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";

import { FinnishPostalCode } from "~/graphql/generation/scalarTypes";
import { validateFinnishPostalCode } from "~/utils/validation/converters";

const ERROR_MESSAGE = "PostalCode must be a valid a valid 5 digit postal code";

export const PersonalIdentityCodeResolver = new GraphQLScalarType({
  name: "Finnish Postal Code",
  description: "PostalCode type for Finnish postal codes",

  serialize(value: FinnishPostalCode): string {
    return value.toString();
  },

  parseValue(value: string): FinnishPostalCode {
    const result = validateFinnishPostalCode(value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },

  parseLiteral(ast: ValueNode): FinnishPostalCode {
    if (ast.kind !== "StringValue") {
      throw new ValidationError(ERROR_MESSAGE);
    }
    const result = validateFinnishPostalCode(ast.value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },
});
