import { PhoneNumber } from "libphonenumber-js";
import { DateTime } from "luxon";

import { Maybe } from "~/@types/global";
import { DBSession } from "~/database/connection";
import { createUUID, ID, Table } from "~/database/tables";
import { UUID } from "~/generation/mappers";
import { EmailAddress } from "~/generation/scalars";

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
  email: EmailAddress;
  phoneNumber: string;
  hashedPassword: string;
  accessLevel: [UserAccessLevel];
  createdAt: Date;
  updatedAt: Date | null;
}>;

export type UserTable = {
  internalId: UserID;
  id: UUID;
  username: string;
  email: EmailAddress;
  phoneNumber: string;
  hashedPassword: string;
  accessLevel: [UserAccessLevel];
  timestamp: {
    createdAt: DateTime;
    updatedAt: DateTime | null;
  };
};

export const formatUserRow = (row: UserTableRow): UserTable => ({
  internalId: row.id,
  id: row.uuid,
  accessLevel: row.accessLevel,
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
  email: EmailAddress;
  hashedPassword: string;
  phoneNumber: PhoneNumber;
};

export const userQueries = {
  async get(params: {
    knex: DBSession;
    userId: UserID;
  }): Promise<Maybe<UserTable>> {
    const user = await params
      .knex<UserTableRow>(Table.USERS)
      .where({ id: params.userId })
      .first();

    return user ? formatUserRow(user) : null;
  },

  async getByUUID(params: {
    knex: DBSession;
    userUUID: UUID;
  }): Promise<Maybe<UserTable>> {
    const user = await params
      .knex<UserTableRow>(Table.USERS)
      .where({ uuid: params.userUUID })
      .first();

    return user ? formatUserRow(user) : null;
  },

  async getByUsername(params: {
    knex: DBSession;
    username: string;
  }): Promise<Maybe<UserTable>> {
    const user = await params
      .knex<UserTableRow>(Table.USERS)
      .where({ username: params.username })
      .first();

    return user ? formatUserRow(user) : null;
  },

  async create(params: {
    knex: DBSession;
    newUser: CreateUserValues;
  }): Promise<UserTable> {
    const users = await params
      .knex<UserTableRow>(Table.USERS)
      .insert({
        uuid: createUUID(),
        username: params.newUser.username,
        email: params.newUser.email,
        hashedPassword: params.newUser.hashedPassword,
        phoneNumber: params.newUser.phoneNumber.formatInternational(),
      })
      .returning("*");

    return formatUserRow(users[0]);
  },

  async getUsersByIds(params: {
    knex: DBSession;
    userIds: readonly UserID[];
  }): Promise<UserTable[]> {
    const userRows = await params
      .knex<UserTableRow>(Table.PERSONS)
      .whereIn("id", params.userIds);

    return userRows.map(formatUserRow);
  },
};
