import { PhoneNumber } from "google-libphonenumber";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import { DataSourceWithContext } from "~/dataSources/DataSourceWithContext";
import { Table, UserTableRaw } from "~/database/types";
import { UUID } from "~/models";

export type UserTable = {
  id: number;
  UUID: UUID;
  username: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
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
      UUID: row.uuid,
      username: row.username,
      email: row.email,
      phoneNumber: row.phoneNumber,
      hashedPassword: row.hashedPassword,
      timestamp: {
        createdAt: DateTime.fromJSDate(row.createdAt),
        updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
      },
    };
  }

  public async createUser(opts: { newUser: CreateUserValues }) {
    const user = await this.knex<UserTableRaw>(Table.USERS)
      .insert({
        uuid: (uuidv4() as unknown) as UUID,
        username: opts.newUser.username,
        email: opts.newUser.email,
        hashedPassword: opts.newUser.hashedPassword,
        phoneNumber: opts.newUser.phoneNumber.getRawInput(),
      })
      .returning("*")
      .first();

    if (!user) {
      throw new Error("Could not insert user");
    }

    return this.formatRow(user);
  }

  public async getUser(opts: {
    id?: number;
    uuid?: UUID;
    username?: string;
    email?: string;
  }) {
    const user = await this.knex<UserTableRaw>(Table.USERS).where(opts).first();

    return user ? this.formatRow(user) : null;
  }
}
