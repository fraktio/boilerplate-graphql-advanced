import { mergeResolvers } from "graphql-tools";

import { authenticationResolver } from "./authenticationResolver";
import { companyResolver } from "./companyResolver";
import { employeeResolver } from "./employeeResolver";
import { genericResolver } from "./genericResolver";
import { personResolver } from "./personResolver";
import { registrationResolver } from "./registrationResolver";
import { userResolver } from "./userResolver";

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
