import {
  EmailAddressResolver,
  PhoneNumberResolver,
  UUIDResolver,
} from "graphql-scalars";

import { Resolvers } from "~/generated/graphql";
import { DateResolver } from "~/graphql/resolvers/scalarsResolvers/DateResolver";
import { DateTimeResolver } from "~/graphql/resolvers/scalarsResolvers/DateTimeResolver";

export const scalarsResolver: Resolvers = {
  UUID: UUIDResolver,
  Date: DateResolver,
  DateTime: DateTimeResolver,
  PhoneNumber: PhoneNumberResolver,
  EmailAddress: EmailAddressResolver,
};
