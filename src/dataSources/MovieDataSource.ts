import { ApolloError } from "apollo-server-express";
import { DateTime } from "luxon";

import { CastTableRaw } from "./CastDataSource";
import { GenresTableRaw } from "./GenreDataSource";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import {
  tableColumn,
  Table,
  MovieTableRaw,
  MovieGenreRelationTableRaw,
  PersonTableRaw,
} from "~/database/types";

export type MovieTable = {
  id: number;
  uuid: string;
  title: string;
  rating: number;
  releaseDate: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
};

export class MovieDataSource extends DataSourceWithContext {
  private formatRow(row: MovieTableRaw): MovieTable {
    return {
      id: row.id,
      uuid: row.uuid,
      title: row.title,
      rating: row.rating,
      releaseDate: DateTime.fromJSDate(row.releaseDate),
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: DateTime.fromJSDate(row.updatedAt),
    };
  }

  public async getMoviesOfGenre(opts: { id?: number; uuid?: string }) {
    const movies = await this.knex
      .select<MovieTableRaw[]>(`${Table.MOVIES}.*`)
      .from(Table.MOVIES)
      .innerJoin(
        Table.MOVIE_GENRE_RELATION,
        tableColumn<MovieGenreRelationTableRaw>(
          Table.MOVIE_GENRE_RELATION,
          "movieId",
        ),
        "=",
        tableColumn<MovieTableRaw>(Table.MOVIES, "id"),
      )
      .innerJoin(
        Table.GENRES,
        tableColumn<GenresTableRaw>(Table.GENRES, "id"),
        "=",
        tableColumn<MovieGenreRelationTableRaw>(
          Table.MOVIE_GENRE_RELATION,
          "genreId",
        ),
      )
      .where({
        ...(opts.id && { [tableColumn(Table.GENRES, "id")]: opts.id }),
        ...(opts.uuid && { [tableColumn(Table.GENRES, "uuid")]: opts.uuid }),
      });

    return movies.map(this.formatRow);
  }

  public async getMoviesOfPerson(opts: { id?: number; uuid?: string }) {
    const movies = await this.knex
      .select<MovieTableRaw[]>(`${Table.MOVIES}.*`)
      .from(Table.MOVIES)
      .innerJoin(
        Table.CAST,
        tableColumn<MovieTableRaw>(Table.MOVIES, "id"),
        "=",
        tableColumn<CastTableRaw>(Table.CAST, "movieId"),
      )
      .innerJoin(
        Table.PERSONS,
        tableColumn<CastTableRaw>(Table.CAST, "personId"),
        "=",
        tableColumn<PersonTableRaw>(Table.PERSONS, "id"),
      )
      .where({
        ...(opts.id && {
          [tableColumn<PersonTableRaw>(Table.PERSONS, "id")]: opts.id,
        }),
        ...(opts.uuid && {
          [tableColumn<PersonTableRaw>(Table.PERSONS, "uuid")]: opts.uuid,
        }),
      });

    return movies.map(this.formatRow);
  }

  public async getMovie(opts: { id?: number; uuid?: string }) {
    const movie = await this.knex<MovieTableRaw>(Table.MOVIES)
      .where(opts)
      .first();

    if (!movie) {
      throw new ApolloError("Internal error");
    }

    return this.formatRow(movie);
  }

  public async maybeGetMovie(opts: { id?: number; uuid?: string }) {
    const movie = await this.knex<MovieTableRaw>(Table.MOVIES)
      .where(opts)
      .first();

    return movie ? this.formatRow(movie) : null;
  }

  public async getMovies() {
    const movies = await this.knex<MovieTableRaw>(Table.MOVIES);

    return movies.map(this.formatRow);
  }
}
