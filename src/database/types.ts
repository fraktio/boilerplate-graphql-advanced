export enum Table {
  USERS = "users",
  MOVIES = "movies",
  GENRES = "genres",
  PERSONS = "persons",
  CAST = "cast",
  MOVIE_GENRE_RELATION = "movieGenreRelation",
}

export const tableColumn = <T extends Record<string, unknown>>(
  table: Table,
  column: keyof T,
) => [table, column].join(".");

export type UserTableRaw = Readonly<{
  id: number;
  uuid: string;
  username: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type PersonTableRaw = Readonly<{
  id: number;
  uuid: string;
  firstName: string;
  familyName: string;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date;
}>;

export type MovieGenreRelationTableRaw = Readonly<{
  id: number;
  movieId: number;
  genreId: number;
  createdAt: Date;
}>;

export type MovieTableRaw = Readonly<{
  id: number;
  uuid: string;
  title: string;
  rating: number;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}>;
