import { mergeResolvers } from "@graphql-tools/merge";

import { authenticationResolver } from "./authenticationResolver";
import { genreResolver } from "./genreResolver";
import { movieResolver } from "./movieResolver";
import { pageResolver } from "./pageResolver";
import { personResolver } from "./personResolver";
import { registrationResolver } from "./registrationResolver";
import { scalarsResolver } from "./scalarsResolvers/scalarsResolver";
import { userResolver } from "./userResolver";

const resolversArray = [
  authenticationResolver,
  pageResolver,
  registrationResolver,
  scalarsResolver,
  userResolver,
  genreResolver,
  movieResolver,
  personResolver,
];

export const resolvers = mergeResolvers(resolversArray);
