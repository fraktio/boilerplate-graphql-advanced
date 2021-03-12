import DataLoader from "dataloader";

import { companyDB, CompanyID, CompanyTable } from "./companyDatabase";

import {
  AbstractDataLoaderBase,
  DataLoaderParams,
} from "~/database/AbstractDataLoader";

export type CompanyLoader = DataLoader<CompanyID, CompanyTable | null>;

export class CompanyDataLoader extends AbstractDataLoaderBase<CompanyLoader> {
  protected createLoader(params: DataLoaderParams): CompanyLoader {
    const companyLoader: CompanyLoader = new DataLoader(async (ids) => {
      const companies = await companyDB.getCompaniesByIds({
        knex: params.knex,
        companyIds: ids,
      });

      return ids.map(
        (id) => companies.find((company) => company.id === id) || null,
      );
    });

    return companyLoader;
  }
}
