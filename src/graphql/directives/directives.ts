import { AuthenticatedDirective } from "~/graphql/directives/authenticatedDirective";

export const createSchemaDirectives = () => ({
  authenticated: AuthenticatedDirective,
});
