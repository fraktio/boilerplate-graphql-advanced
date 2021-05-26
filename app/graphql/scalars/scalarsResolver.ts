import { UUIDResolver } from "graphql-scalars";

import { CountryCodeResolver } from "./CountryCodeResolver";
import { DateResolver } from "./DateResolver";
import { DateTimeResolver } from "./DateTimeResolver";
import { EmailResolver } from "./EmailResolver";
import { PhoneNumberResolver } from "./PhoneNumberResolver";

import { Resolvers } from "~/generation/generated";

export const createScalarResolvers = (): Resolvers => ({
  UUID: UUIDResolver,
  Date: DateResolver,
  DateTime: DateTimeResolver,
  EmailAddress: EmailResolver,
  PhoneNumber: PhoneNumberResolver,
  CountryCode: CountryCodeResolver,
});
