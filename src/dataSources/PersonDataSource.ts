import { DateTime } from "luxon";

import { CastTableRaw } from "./CastDataSource";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import {
  MovieTableRaw,
  PersonTableRaw,
  Table,
  tableColumn,
} from "~/database/types";

export type PersonTable = {
  id: number;
  uuid: string;
  firstName: string;
  familyName: string;
  birthday: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
};

export class PersonDataSource extends DataSourceWithContext {
  private formatRow(row: PersonTableRaw): PersonTable {
    return {
      id: row.id,
      uuid: row.uuid,
      firstName: row.firstName,
      familyName: row.familyName,
      birthday: DateTime.fromJSDate(row.birthday),
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: DateTime.fromJSDate(row.updatedAt),
    };
  }

  public async getPersonsOfMovie(opts: { id?: number; uuid?: string }) {
    const genres = await this.knex
      .select<PersonTableRaw[]>(`${Table.PERSONS}.*`)
      .from(Table.PERSONS)
      .innerJoin(
        Table.CAST,
        tableColumn<CastTableRaw>(Table.CAST, "personId"),
        "=",
        tableColumn<PersonTableRaw>(Table.PERSONS, "id"),
      )
      .innerJoin(
        Table.MOVIES,
        tableColumn<MovieTableRaw>(Table.MOVIES, "id"),
        "=",
        tableColumn<CastTableRaw>(Table.CAST, "movieId"),
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

  public async getPerson(opts: { id?: number; uuid?: string }) {
    const person = await this.knex<PersonTableRaw>(Table.PERSONS)
      .where(opts)
      .first();

    return person ? this.formatRow(person) : null;
  }

  public async getPersons() {
    this.ensureAuthenticatedUser();

    const personsRaw = await this.knex<PersonTableRaw>(Table.PERSONS);

    return personsRaw.map(this.formatRow);
  }
}
