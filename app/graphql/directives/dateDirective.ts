/* eslint-disable max-params */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLSchema, GraphQLString } from "graphql";
import { DateTime } from "luxon";

const directiveName = "dateFormat";

export function formattableDateDirectiveTransformer(
  schema: GraphQLSchema,
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const dateDirective = getDirective(
        schema,
        fieldConfig,
        directiveName,
      )?.[0];
      if (dateDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        const { defaultFormat } = dateDirective;

        if (!fieldConfig.args) {
          throw new Error("Unexpected Error. args should be defined.");
        }

        console.log("---------e-----w-eWOOT ", fieldConfig.args.format);
        fieldConfig.args.format = {
          type: GraphQLString,
        };

        fieldConfig.type = GraphQLString;

        fieldConfig.resolve = async (
          source,
          { format, ...args },
          context,
          info,
        ) => {
          const newFormat = format || defaultFormat;
          const date = (await resolve(source, args, context, info)) as DateTime;

          console.log("kekkeroos", date);

          return date;
          //      return date.toFormat(newFormat);
        };

        return fieldConfig;
      }
    },
  });
}
