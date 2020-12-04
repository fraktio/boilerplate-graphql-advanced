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
