import { ValidationError } from "apollo-server-express";
import { GraphQLScalarType, ValueNode } from "graphql";

import { CountryCode } from "~/generation/scalars";
import { validateCountryCode } from "~/validation/validators/countryCodeValidator";

const ERROR_MESSAGE = "Country code must be a valid two digit national code";

export const CountryCodeResolver = new GraphQLScalarType({
  description: "Country code custom scalar type",
  name: "CountryCode",

  serialize(value: CountryCode): string {
    return value.toString();
  },

  parseValue(value: string): CountryCode {
    const result = validateCountryCode(value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },

  parseLiteral(ast: ValueNode): CountryCode {
    if (ast.kind !== "StringValue") {
      throw new ValidationError(ERROR_MESSAGE);
    }
    const result = validateCountryCode(ast.value);

    if (result.success) {
      return result.value;
    }
    throw new ValidationError(ERROR_MESSAGE);
  },
});
