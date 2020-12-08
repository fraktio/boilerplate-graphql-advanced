import Knex from "knex";

import { CompanyDataLoader } from "./CompanyDataLoader";
import { PersonDataLoader } from "./PersonDataLoader";

export type DataLoaders = {
  personDL: PersonDataLoader;
  companyDL: CompanyDataLoader;
};

export type DataLoaderParams = {
  knex: Knex;
};

export const createDataLoaders = (opts: DataLoaderParams) => ({
  personDL: new PersonDataLoader(opts),
  companyDL: new CompanyDataLoader(opts),
});
