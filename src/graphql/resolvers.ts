import { mergeResolvers } from "@graphql-tools/merge";

import { authenticationResolver } from "./typeDefs/authentication/authenticationResolver";
import { genericResolver } from "./typeDefs/common/genericResolver";
import { genreResolver } from "./typeDefs/genre/genreResolver";
import { movieResolver } from "./typeDefs/movie/movieResolver";
import { pageResolver } from "./typeDefs/page/pageResolver";
import { personResolver } from "./typeDefs/person/personResolver";
import { registrationResolver } from "./typeDefs/registration/registrationResolver";
import { userResolver } from "./typeDefs/user/userResolver";

const resolversArray = [
  authenticationResolver,
  pageResolver,
  registrationResolver,
  genericResolver,
  userResolver,
  genreResolver,
  movieResolver,
  personResolver,
];

export const resolvers = mergeResolvers(resolversArray);
