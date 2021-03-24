import { mergeResolvers } from "graphql-tools";

import { authenticationResolver } from "./authenticationResolver";
import { companyResolver } from "./companyResolver";
import { employeeResolver } from "./employeeResolver";
import { genericResolver } from "./genericResolver";
import { numberFactResolver } from "./numberFactResolver";
import { personResolver } from "./personResolver";
import { registrationResolver } from "./registrationResolver";

import { createScalarResolvers } from "~/graphql/scalars/scalarsResolver";

const resolversArray = [
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
