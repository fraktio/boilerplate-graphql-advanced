import DataLoader from "dataloader";

import { companyDB, CompanyID, CompanyTable } from "~/database/companyDB";
import { DBConnection } from "~/database/connection";

export class CompanyDL {
  dataloader: DataLoader<CompanyID, CompanyTable> | undefined;

  public getDL(params: { knex: DBConnection }) {
    if (!this.dataloader) {
      return this.createDataLoader({ knex: params.knex });
    }

    return this.dataloader;
  }

  private createDataLoader(params: { knex: DBConnection }) {
    this.dataloader = new DataLoader<CompanyID, CompanyTable>(async (keys) => {
      const personRows = await companyDB.getByIds({
        knex: params.knex,
        companyIds: keys as CompanyID[],
      });

      const persons = personRows.reduce<{ [key: string]: CompanyTable }>(
        (prev, current) => ({
          ...prev,
          [current.id.toString()]: current,
        }),
        {},
      );

      return keys.map((key) => persons[key.toString()] ?? null);
    });
  }
}
