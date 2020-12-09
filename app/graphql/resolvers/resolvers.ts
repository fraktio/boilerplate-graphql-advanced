import { mergeResolvers } from "graphql-tools";

import { authenticationResolver } from "./authenticationResolver";
import { companyResolver } from "./companyResolver";
import { employeeResolver } from "./employeeResolver";
import { genericResolver } from "./genericResolver";
import { personResolver } from "./personResolver";
import { registrationResolver } from "./registrationResolver";
import { scalarsResolver } from "./scalarsResolvers/scalarsResolver";
import { userResolver } from "./userResolver";

const resolversArray = [
  authenticationResolver,
  companyResolver,
  registrationResolver,
  scalarsResolver,
  userResolver,
  personResolver,
  genericResolver,
  employeeResolver,
];

export const resolvers = mergeResolvers(resolversArray);
