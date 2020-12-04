import { DateTime } from "luxon";

export type MovieGenreRelationTable = {
  id: number;
  movieId: number;
  genreId: number;
  createdAt: DateTime;
};
