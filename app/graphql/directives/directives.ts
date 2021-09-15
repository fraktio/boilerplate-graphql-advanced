import { GraphQLSchema } from "graphql";

import { authDirectiveTransformer } from "~/graphql/directives/authenticatedDirective";
import { formattableDateDirectiveTransformer } from "~/graphql/directives/dateDirective";
import { lengthDirectiveTransformer } from "~/graphql/directives/lengthDirective";

const directives = [
  authDirectiveTransformer,
  lengthDirectiveTransformer,
  formattableDateDirectiveTransformer,
];

export const applyDirectivestToSchema = (
  schema: GraphQLSchema,
): GraphQLSchema =>
  directives.reduce(
    (schemaToBeApllied, directive) => directive(schemaToBeApllied),
    schema,
  );
