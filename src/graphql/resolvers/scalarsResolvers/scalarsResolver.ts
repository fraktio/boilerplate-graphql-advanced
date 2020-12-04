import { EmailAddressResolver, PhoneNumberResolver } from "graphql-scalars";

import { Resolvers } from "~/generated/graphql";
import { DateResolver } from "~/graphql/resolvers/scalarsResolvers/DateResolver";
import { DateTimeResolver } from "~/graphql/resolvers/scalarsResolvers/DateTimeResolver";

export const scalarsResolver: Resolvers = {
  Date: DateResolver,
  DateTime: DateTimeResolver,
  PhoneNumber: PhoneNumberResolver,
  EmailAddress: EmailAddressResolver,
};
