import { DateTime } from "luxon";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import {
  tableColumn,
  Table,
  MovieGenreRelationTableRaw,
  MovieTableRaw,
} from "~/database/types";

export type GenresTable = {
  id: number;
  uuid: string;
  type: string;
  createdAt: DateTime;
  updatedAt: DateTime;
};

export type GenresTableRaw = {
  id: number;
  uuid: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export class GenreDataSource extends DataSourceWithContext {
  private formatRow(row: GenresTableRaw): GenresTable {
    return {
      id: row.id,
      uuid: row.uuid,
      type: row.type,
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: DateTime.fromJSDate(row.updatedAt),
    };
  }

  public async getGenresOfMovie(opts: { id?: number; uuid?: string }) {
    const genres = await this.knex
      .select<GenresTableRaw[]>(`${Table.GENRES}.*`)
      .from(Table.GENRES)
      .innerJoin(
        Table.MOVIE_GENRE_RELATION,
        tableColumn<MovieGenreRelationTableRaw>(
          Table.MOVIE_GENRE_RELATION,
          "genreId",
        ),
        "=",
        tableColumn<GenresTableRaw>(Table.GENRES, "id"),
      )
      .innerJoin(
        Table.MOVIES,
        tableColumn<MovieGenreRelationTableRaw>(
          Table.MOVIE_GENRE_RELATION,
          "movieId",
        ),
        "=",
        tableColumn<MovieTableRaw>(Table.MOVIES, "id"),
      )
      .where({
        ...(opts.id && {
          [tableColumn<MovieTableRaw>(Table.MOVIES, "id")]: opts.id,
        }),
        ...(opts.uuid && {
          [tableColumn<MovieTableRaw>(Table.MOVIES, "uuid")]: opts.uuid,
        }),
      });

    return genres.map(this.formatRow);
  }

  public async getGenre(opts: { id?: number; uuid?: string }) {
    const genre = await this.knex<GenresTableRaw>(Table.GENRES)
      .where(opts)
      .first();

    return genre ? this.formatRow(genre) : null;
  }

  public async getGenres() {
    const genresRaw = await this.knex<GenresTableRaw>(Table.GENRES);

    return genresRaw.map(this.formatRow);
  }
}
