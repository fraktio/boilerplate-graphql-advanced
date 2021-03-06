import type Knex from "knex";

export type DataLoaderParams = {
  knex: Knex;
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
