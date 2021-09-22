import DataLoader from "dataloader";

import { Maybe } from "~/@types/global";
import {
  AbstractDataLoaderBase,
  DataLoaderParams,
} from "~/database/AbstractDataLoader";
import {
  companyQueries,
  CompanyID,
  CompanyTable,
} from "~/database/company/companyQueries";

export type CompanyLoader = DataLoader<CompanyID, Maybe<CompanyTable>>;

export class CompanyDataLoader extends AbstractDataLoaderBase<CompanyLoader> {
  protected createLoader(params: DataLoaderParams): CompanyLoader {
    const companyLoader: CompanyLoader = new DataLoader(async (ids) => {
      const companies = await companyQueries.getCompaniesByIds({
        knex: params.knex,
        companyIds: ids,
      });

      return ids.map(
        (id) => companies.find((company) => company.internalId === id) || null,
      );
    });

    return companyLoader;
  }
}
