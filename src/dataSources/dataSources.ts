import { GenreDataSource } from "./GenreDataSource";
import { MovieDataSource } from "./MovieDataSource";
import { PersonDataSource } from "./PersonDataSource";

import { CreateDataSourceOptions } from "~/dataSources/DataSourceWithContext";
import { UserDataSource } from "~/dataSources/UserDataSource";

export type DataSources = {
  userDS: UserDataSource;
  genreDS: GenreDataSource;
  movieDS: MovieDataSource;
  personDS: PersonDataSource;
};

export const createDataSources = (
  opts: CreateDataSourceOptions,
): DataSources => ({
  userDS: new UserDataSource(opts),
  genreDS: new GenreDataSource(opts),
  movieDS: new MovieDataSource(opts),
  personDS: new PersonDataSource(opts),
});
