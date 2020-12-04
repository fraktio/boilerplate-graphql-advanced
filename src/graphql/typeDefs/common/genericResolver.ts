import { EmailAddressResolver, PhoneNumberResolver } from "graphql-scalars";

import { Resolvers } from "~/generated/graphql";
import { DateResolver } from "~/graphql/scalars/DateScalar";
import { DateTimeResolver } from "~/graphql/scalars/DateTimeResolver";

export const genericResolver: Resolvers = {
  Date: DateResolver,
  DateTime: DateTimeResolver,
  PhoneNumber: PhoneNumberResolver,
  EmailAddress: EmailAddressResolver,
};
