import { DBSession } from "~/database/connection";

export type DataLoaderParams = {
  knex: DBSession;
};

export abstract class AbstractDataLoaderBase<Loaders> {
  private loaders: Loaders | null = null;

  public getLoader(params: DataLoaderParams): Loaders {
    if (!this.loaders) {
      this.loaders = this.createLoader({ knex: params.knex });
    }

    return this.loaders;
  }

  protected abstract createLoader(params: DataLoaderParams): Loaders;
}
