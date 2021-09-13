import { GraphQLSchema } from "graphql";

import { authDirectiveTransformer } from "~/graphql/directives/authenticatedDirective";

const directives = [authDirectiveTransformer];

export const applyDirectivestToSchema = (
  schema: GraphQLSchema,
): GraphQLSchema =>
  directives.reduce(
    (schemaToBeApllied, directive) => directive(schemaToBeApllied),
    schema,
  );
