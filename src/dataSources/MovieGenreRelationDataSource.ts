import { DateTime } from "luxon";

export type MovieGenreRelationTable = {
  id: number;
  movieId: number;
  genreId: number;
  createdAt: DateTime;
};

export type MovieGenreRelationTableRaw = {
  id: number;
  movieId: number;
  genreId: number;
  createdAt: Date;
};
