import { mergeResolvers } from "@graphql-tools/merge";

import { authenticationResolver } from "./authenticationResolver";
import { companyResolver } from "./companyResolver";
import { employeeResolver } from "./employeeResolver";
import { gnericResolver } from "./genericResolver";
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
  gnericResolver,
  employeeResolver,
];

export const resolvers = mergeResolvers(resolversArray);
