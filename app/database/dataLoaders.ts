import { CompanyDataLoader } from "./company/CompanyDataLoader";
import { CompaniesOfPersonDataLoader } from "./employee/CompaniesOfPersonDataLoader";
import { PersonsOfCompanyDataLoader } from "./employee/PersonsOfCompanyDataLoader";
import { UserDataLoader } from "./user/UserDataLoader";

import { PersonDataLoader } from "~/database/person/PersonDataLoader";

export type DataLoaders = {
  companyDL: CompanyDataLoader;
  personDL: PersonDataLoader;
  userDL: UserDataLoader;
  companiesOfPersonDL: CompaniesOfPersonDataLoader;
  personsOfCompanyDL: PersonsOfCompanyDataLoader;
};

export const createDataLoaders = (): DataLoaders => ({
  companyDL: new CompanyDataLoader(),
  personDL: new PersonDataLoader(),
  userDL: new UserDataLoader(),
  companiesOfPersonDL: new CompaniesOfPersonDataLoader(),
  personsOfCompanyDL: new PersonsOfCompanyDataLoader(),
});
