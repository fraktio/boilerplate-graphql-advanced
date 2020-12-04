import { Genre, Movie, Person } from "./generated/graphql";

export type MovieModel = Omit<Movie, "genres" | "cast">;

export type GenreModel = Omit<Genre, "movies">;

export type PersonModel = Omit<Person, "movies">;
