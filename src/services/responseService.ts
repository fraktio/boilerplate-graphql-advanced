import { GenresTable } from "~/dataSources/GenreDataSource";
import { MovieTable } from "~/dataSources/MovieDataSource";
import { PersonTable } from "~/dataSources/PersonDataSource";
import { GenreModel, MovieModel, PersonModel } from "~/models";

export class ResponseService {
  formatGenre(row: GenresTable): GenreModel {
    return {
      uuid: row.uuid,
      type: row.type,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  formarMovie(row: MovieTable): MovieModel {
    return {
      uuid: row.uuid,
      title: row.title,
      rating: row.rating,
      releaseDate: row.releaseDate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  formatPerson(row: PersonTable): PersonModel {
    return {
      uuid: row.uuid,
      firstName: row.firstName,
      familyName: row.familyName,
      birthday: row.birthday,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
