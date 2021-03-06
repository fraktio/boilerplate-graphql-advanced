import { DBConnection } from "~/database/connection";

export type DataLoaderParams = {
  knex: DBConnection;
};

export abstract class AbstractDataLoaderBase<Loaders> {
  private loaders: Loaders | null = null;

  public getLoaders(params: DataLoaderParams): Loaders {
    if (!this.loaders) {
      this.loaders = this.createLoader({ knex: params.knex });
    }

    return this.loaders;
  }

  protected abstract createLoader(params: DataLoaderParams): Loaders;
}
