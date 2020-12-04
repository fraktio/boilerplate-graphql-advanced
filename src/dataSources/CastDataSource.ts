import { DateTime } from "luxon";

export type CastTable = {
  id: number;
  movieId: number;
  personId: number;
  createdAt: DateTime;
};

export type CastTableRaw = {
  id: number;
  movieId: number;
  personId: number;
  createdAt: Date;
};
