import { mergeResolvers } from "graphql-tools";

import { authenticationResolver } from "./authentication/authenticationResolver";
import { companyResolver } from "./company/companyResolver";
import { employeeResolver } from "./employee/employeeResolver";
import { genericResolver } from "./generic/genericResolver";
import { personResolver } from "./person/personResolver";
import { registrationResolver } from "./registration/registrationResolver";
import { userResolver } from "./user/userResolver";

import { createScalarResolvers } from "~/graphql/scalars/scalarsResolver";

const resolversArray = [
  authenticationResolver,
  companyResolver,
  registrationResolver,
  userResolver,
  personResolver,
  genericResolver,
  employeeResolver,
  createScalarResolvers(),
];

export const resolvers = mergeResolvers(resolversArray);
