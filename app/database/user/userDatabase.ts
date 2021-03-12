import { PhoneNumber } from "google-libphonenumber";
import { DateTime } from "luxon";

import { DBConnection } from "~/database/connection";
import { createUUID, ID, Table } from "~/database/tables";
import { Maybe } from "~/generation/generated";
import { UUID } from "~/generation/mappers";

export interface UserID extends ID {
  __UserID: never;
}

export enum UserAccessLevel {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type UserTableRow = Readonly<{
  id: UserID;
  uuid: UUID;
  username: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type UserTable = {
  id: UserID;
  UUID: UUID;
  username: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
  accessLevel: [UserAccessLevel];
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
};

export const formatUserRow = (row: UserTableRow): UserTable => ({
  id: row.id,
  UUID: row.uuid,
  accessLevel: [UserAccessLevel.USER],
  username: row.username,
  email: row.email,
  phoneNumber: row.phoneNumber,
  hashedPassword: row.hashedPassword,
  timestamp: {
    createdAt: DateTime.fromJSDate(row.createdAt),
    updatedAt: row.updatedAt ? DateTime.fromJSDate(row.updatedAt) : null,
  },
});

type CreateUserValues = {
  username: string;
  email: string;
  hashedPassword: string;
  phoneNumber: PhoneNumber;
};

export const userDB = {
  async get(params: {
    knex: DBConnection;
    userId: UserID;
  }): Promise<Maybe<UserTable>> {
    const user = await params
      .knex<UserTableRow>(Table.USERS)
      .where({ id: params.userId })
      .first();

    return user ? formatUserRow(user) : null;
  },

  async getByUUID(params: {
    knex: DBConnection;
    userUUID: UUID;
  }): Promise<Maybe<UserTable>> {
    const user = await params
      .knex<UserTableRow>(Table.USERS)
      .where({ uuid: params.userUUID })
      .first();

    return user ? formatUserRow(user) : null;
  },

  async getByUsername(params: {
    knex: DBConnection;
    username: string;
  }): Promise<Maybe<UserTable>> {
    const user = await params
      .knex<UserTableRow>(Table.USERS)
      .where({ username: params.username })
      .first();

    return user ? formatUserRow(user) : null;
  },

  async create(params: {
    knex: DBConnection;
    newUser: CreateUserValues;
  }): Promise<UserTable> {
    const users = await params
      .knex<UserTableRow>(Table.USERS)
      .insert({
        uuid: createUUID(),
        username: params.newUser.username,
        email: params.newUser.email,
        hashedPassword: params.newUser.hashedPassword,
        phoneNumber: params.newUser.phoneNumber.getRawInput(),
      })
      .returning("*");

    return formatUserRow(users[0]);
  },

  async getUsersByIds(params: {
    knex: DBConnection;
    userIds: readonly UserID[];
  }): Promise<UserTable[]> {
    const userRows = await params
      .knex<UserTableRow>(Table.PERSONS)
      .whereIn("id", params.userIds);

    return userRows.map(formatUserRow);
  },
};
