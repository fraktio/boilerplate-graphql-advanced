/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import {
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  isNonNullType,
  isScalarType,
} from "graphql";

const directiveName = "length";

const limitedLengthTypes: Record<
  string,
  Record<string, GraphQLScalarType>
> = {};

export function lengthDirectiveTransformer(
  schema: GraphQLSchema,
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.FIELD]: (fieldConfig) => {
      const lengthDirective = getDirective(
        schema,
        fieldConfig,
        directiveName,
      )?.[0];
      if (lengthDirective) {
        wrapType(fieldConfig, lengthDirective);

        return fieldConfig;
      }
    },
  });
}

function wrapType<
  F extends GraphQLFieldConfig<any, any> | GraphQLInputFieldConfig,
>(fieldConfig: F, directiveArgumentMap: Record<string, any>): void {
  if (
    isNonNullType(fieldConfig.type) &&
    isScalarType(fieldConfig.type.ofType)
  ) {
    fieldConfig.type = getLimitedLengthType(
      fieldConfig.type.ofType,
      directiveArgumentMap.min,
      directiveArgumentMap.max,
    );
  } else if (isScalarType(fieldConfig.type)) {
    fieldConfig.type = getLimitedLengthType(
      fieldConfig.type,
      directiveArgumentMap.min,

      directiveArgumentMap.max,
    );
  } else {
    throw new Error(`Not a scalar type: ${fieldConfig.type.toString()}`);
  }
}

function getLimitedLengthType(
  type: GraphQLScalarType,
  minLength: number | undefined,
  maxLength: number | undefined,
): GraphQLScalarType {
  const limitedLengthTypesByTypeName = limitedLengthTypes[type.name];
  const name = `${minLength || ""}-${maxLength || ""}`;

  if (!limitedLengthTypesByTypeName) {
    const newType = new LimitedLengthType(type, minLength, maxLength);

    limitedLengthTypes[type.name] = {};
    limitedLengthTypes[type.name][name] = newType;

    return newType;
  }

  const limitedLengthType = limitedLengthTypesByTypeName[name];

  if (!limitedLengthType) {
    const newType = new LimitedLengthType(type, minLength, maxLength);
    limitedLengthTypesByTypeName[name] = newType;

    return newType;
  }

  return limitedLengthType;
}

class LimitedLengthType extends GraphQLScalarType {
  constructor(
    type: GraphQLScalarType,
    minLength: number | undefined,
    maxLength: number | undefined,
  ) {
    const getName = (
      type: GraphQLScalarType,
      minLength: number | undefined,
      maxLength: number | undefined,
    ): string => {
      if (maxLength && minLength) {
        return `${
          type.name
        }WithMaxLength${maxLength.toString()}AndMinLength${minLength.toString()}`;
      }

      if (maxLength && !minLength) {
        return `${type.name}WithMaxLength${maxLength.toString()}`;
      }

      if (!maxLength && minLength) {
        return `${type.name}WithMinLength${minLength.toString()}`;
      }

      return `${type.name}WithNoLength`;
    };

    super({
      name: getName(type, minLength, maxLength),

      serialize(value: string) {
        const newValue: string = type.serialize(value);
        expect(typeof newValue.length).toBe("number");
        enforceLength(value, { maxLength: maxLength, minlength: minLength });

        return newValue;
      },

      parseValue(value: string) {
        enforceLength(value, { maxLength: maxLength, minlength: minLength });

        return type.parseValue(value);
      },

      parseLiteral(ast) {
        if (ast.kind !== "StringValue") {
          throw new Error(
            `${ast.kind} has invalid argument value for length directive`,
          );
        }
        enforceLength(ast.value, {
          maxLength: maxLength,
          minlength: minLength,
        });

        return type.parseLiteral(ast, {});
      },
    });
  }
}

const enforceLength = (
  value: string,
  rules: { maxLength: number | undefined; minlength: number | undefined },
): string => {
  if (rules.maxLength && value.length > rules.maxLength) {
    throw new Error(
      `expected ${value.length.toString(
        10,
      )} to be at most ${rules.maxLength.toString(10)}`,
    );
  }

  if (rules.minlength && value.length < rules.minlength) {
    throw new Error(
      `expected ${value.length.toString(
        10,
      )} to be at at least ${rules.minlength.toString(10)}`,
    );
  }

  return value;
};
