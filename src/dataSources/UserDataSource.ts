import { PhoneNumber } from "google-libphonenumber";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import { Table } from "~/database/types";

export type UserTableRaw = {
  id: number;
  uuid: string;
  username: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserTable = {
  id: number;
  uuid: string;
  username: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
  createdAt: DateTime;
  updatedAt: DateTime;
};

type CreateUserValues = {
  username: string;
  email: string;
  hashedPassword: string;
  phoneNumber: PhoneNumber;
};

export class UserDataSource extends DataSourceWithContext {
  private formatRow(row: UserTableRaw): UserTable {
    return {
      id: row.id,
      uuid: row.uuid,
      username: row.username,
      email: row.email,
      phoneNumber: row.phoneNumber,
      hashedPassword: row.hashedPassword,
      createdAt: DateTime.fromJSDate(row.createdAt),
      updatedAt: DateTime.fromJSDate(row.updatedAt),
    };
  }

  public async createUser(opts: { newUser: CreateUserValues }) {
    const user = await this.knex<UserTableRaw>(Table.USERS)
      .insert({
        uuid: uuidv4(),
        username: opts.newUser.username,
        email: opts.newUser.email,
        hashedPassword: opts.newUser.hashedPassword,
        phoneNumber: opts.newUser.phoneNumber.getRawInput(),
      })
      .returning("*")
      .first();

    return user ? this.formatRow(user) : user;
  }

  public async getUser(opts: {
    id?: number;
    uuid?: string;
    username?: string;
    email?: string;
  }) {
    const user = await this.knex<UserTableRaw>(Table.USERS).where(opts).first();

    return user ? this.formatRow(user) : null;
  }
}
