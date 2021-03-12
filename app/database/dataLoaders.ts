import { CompanyDataLoader } from "./company/CompanyDataLoader";
import { UserDataLoader } from "./user/UserDataLoader";

import { PersonDataLoader } from "~/database/person/PersonDataLoader";

export type DataLoaders = {
  companyDL: CompanyDataLoader;
  personDL: PersonDataLoader;
  userDL: UserDataLoader;
};

export const createDataLoaders = () => ({
  companyDL: new CompanyDataLoader(),
  personDL: new PersonDataLoader(),
  userDL: new UserDataLoader(),
});
