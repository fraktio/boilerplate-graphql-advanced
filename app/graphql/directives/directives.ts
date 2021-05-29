import { AuthenticatedDirective } from "~/graphql/directives/authenticatedDirective";

type ChemaDirectives = {
  authenticated: typeof AuthenticatedDirective;
};

export const createSchemaDirectives = (): ChemaDirectives => ({
  authenticated: AuthenticatedDirective,
});
