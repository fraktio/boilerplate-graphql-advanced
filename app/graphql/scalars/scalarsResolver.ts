import { UUIDResolver } from "graphql-scalars";
import { GraphQLUpload } from "graphql-upload";

import { Resolvers } from "~/generation/generated";
import { CountryCodeResolver } from "~/graphql/scalars/CountryCodeResolver";
import { CursorResolver } from "~/graphql/scalars/CursorResolver";
import { DateResolver } from "~/graphql/scalars/DateResolver";
import { DateTimeResolver } from "~/graphql/scalars/DateTimeResolver";
import { EmailResolver } from "~/graphql/scalars/EmailResolver";
import { PhoneNumberResolver } from "~/graphql/scalars/PhoneNumberResolver";

export const createScalarResolvers = (): Resolvers => ({
  UUID: UUIDResolver,
  Date: DateResolver,
  Upload: GraphQLUpload,
  DateTime: DateTimeResolver,
  EmailAddress: EmailResolver,
  PhoneNumber: PhoneNumberResolver,
  CountryCode: CountryCodeResolver,
  Cursor: CursorResolver,
});
