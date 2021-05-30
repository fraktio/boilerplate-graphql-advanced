import { CompanyDataLoader } from "~/database/company/CompanyDataLoader";
import { CompaniesOfPersonDataLoader } from "~/database/employee/CompaniesOfPersonDataLoader";
import { PersonsOfCompanyDataLoader } from "~/database/employee/PersonsOfCompanyDataLoader";
import { PersonDataLoader } from "~/database/person/PersonDataLoader";
import { UserDataLoader } from "~/database/user/UserDataLoader";

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
