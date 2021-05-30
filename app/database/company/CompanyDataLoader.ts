import DataLoader from "dataloader";

import { companyQueries, CompanyID, CompanyTable } from "./companyQueries";

import {
  AbstractDataLoaderBase,
  DataLoaderParams,
} from "~/database/AbstractDataLoader";
import { Maybe } from "~/generation/generated";

export type CompanyLoader = DataLoader<CompanyID, Maybe<CompanyTable>>;

export class CompanyDataLoader extends AbstractDataLoaderBase<CompanyLoader> {
  protected createLoader(params: DataLoaderParams): CompanyLoader {
    const companyLoader: CompanyLoader = new DataLoader(async (ids) => {
      const companies = await companyQueries.getCompaniesByIds({
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
