import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";

import { FinnishPersonalIdentityCode } from "~/@types/scalarTypes";
import { validateFinnishPersonalIdentityCode } from "~/validation/converters";

const ERROR_MESSAGE =
  "PersonalIdentityCode must be a valid personal identity code";

export const FinnishPErsonalIdentityCodeResolver = new GraphQLScalarType({
  description: "PersonalIdentityCode custom scalar type",
  name: "PersonalIdentityCode",

  serialize(value: FinnishPersonalIdentityCode): string {
    return value.toString();
  },

  parseValue(value: string): FinnishPersonalIdentityCode {
    const result = validateFinnishPersonalIdentityCode(value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },

  parseLiteral(ast: ValueNode): FinnishPersonalIdentityCode {
    if (ast.kind !== "StringValue") {
      throw new ValidationError(ERROR_MESSAGE);
    }
    const result = validateFinnishPersonalIdentityCode(ast.value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },
});