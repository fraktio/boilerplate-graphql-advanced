import { mergeResolvers } from "graphql-tools";

import { authenticationResolver } from "~/graphql/resolvers/authenticationResolver";
import { companyResolver } from "~/graphql/resolvers/companyResolver";
import { employeeResolver } from "~/graphql/resolvers/employeeResolver";
import { failureResolvers } from "~/graphql/resolvers/failureResolvers";
import { genericResolver } from "~/graphql/resolvers/genericResolver";
import { numberFactResolver } from "~/graphql/resolvers/numberFactResolver";
import { personResolver } from "~/graphql/resolvers/personResolver";
import { registrationResolver } from "~/graphql/resolvers/registrationResolver";
import { createScalarResolvers } from "~/graphql/scalars/scalarsResolver";

const resolversArray = [
  failureResolvers,
  authenticationResolver,
  companyResolver,
  registrationResolver,
  personResolver,
  genericResolver,
  employeeResolver,
  numberFactResolver,
  createScalarResolvers(),
];

export const resolvers = mergeResolvers(resolversArray);
