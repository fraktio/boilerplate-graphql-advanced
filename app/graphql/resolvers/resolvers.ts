import { mergeResolvers } from "@graphql-tools/merge";

import { authenticationResolver } from "~/graphql/resolvers/authenticationResolver";
import { companyResolver } from "~/graphql/resolvers/companyResolver";
import { employeeResolver } from "~/graphql/resolvers/employeeResolver";
import { fileResolver } from "~/graphql/resolvers/fileResolver";
import { genericResolver } from "~/graphql/resolvers/genericResolver";
import { numberFactResolver } from "~/graphql/resolvers/numberFactResolver";
import { personResolver } from "~/graphql/resolvers/personResolver";
import { registrationResolver } from "~/graphql/resolvers/registrationResolver";
import { createScalarResolvers } from "~/graphql/scalars/scalarsResolver";

const resolversArray = [
  authenticationResolver,
  companyResolver,
  registrationResolver,
  personResolver,
  genericResolver,
  employeeResolver,
  numberFactResolver,
  fileResolver,
  createScalarResolvers(),
];

export const resolvers = mergeResolvers(resolversArray);
