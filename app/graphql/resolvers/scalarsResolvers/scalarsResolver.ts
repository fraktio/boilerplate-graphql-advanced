import { UUIDResolver } from "graphql-scalars";

import { DateResolver } from "./DateResolver";
import { DateTimeResolver } from "./DateTimeResolver";
import { EmailResolver } from "./EmailResolver";
import { FinnishPersonalIdentityCodeResolver } from "./FinnishPersonalIdentityCodeResolver";
import { PhoneResolver } from "./PhoneResolver";

import { Resolvers } from "~/generated/graphql";

export const scalarsResolver: Resolvers = {
  UUID: UUIDResolver,
  Date: DateResolver,
  DateTime: DateTimeResolver,
  PhoneNumber: PhoneResolver,
  EmailAddress: EmailResolver,
  FinnishPErsonalIdentityCode: FinnishPersonalIdentityCodeResolver,
};
