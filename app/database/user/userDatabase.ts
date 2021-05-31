import { PhoneNumber } from "libphonenumber-js";

import { DBConnection } from "~/database/connection";
import { UserDataLoader } from "~/database/user/UserDataLoader";
import { userQueries, UserID, UserTable } from "~/database/user/userQueries";
import { Maybe } from "~/generation/generated";
import { UUID } from "~/generation/mappers";
import { EmailAddress } from "~/generation/scalars";

export type CreateUser = {
  username: string;
  email: EmailAddress;
  hashedPassword: string;
  phoneNumber: PhoneNumber;
};

export const userDB = {
  async get(params: {
    knex: DBConnection;
    userId: UserID;
    userDL: UserDataLoader;
  }): Promise<Maybe<UserTable>> {
    const user = await userQueries.get({
      knex: params.knex,
      userId: params.userId,
    });

    if (user) {
      params.userDL.getLoader({ knex: params.knex }).prime(user.id, user);
    }

    return user;
  },

  async getByUsername(params: {
    knex: DBConnection;
    username: string;
    userDL: UserDataLoader;
  }): Promise<Maybe<UserTable>> {
    const user = await userQueries.getByUsername({
      knex: params.knex,
      username: params.username,
    });

    if (user) {
      params.userDL.getLoader({ knex: params.knex }).prime(user.id, user);
    }

    return user;
  },

  async getByUUID(params: {
    knex: DBConnection;
    userUUID: UUID;
    userDL: UserDataLoader;
  }): Promise<Maybe<UserTable>> {
    const user = await userQueries.getByUUID({
      knex: params.knex,
      userUUID: params.userUUID,
    });

    if (user) {
      params.userDL.getLoader({ knex: params.knex }).prime(user.id, user);
    }

    return user;
  },

  async createUser(params: {
    knex: DBConnection;
    newUser: CreateUser;
    userDL: UserDataLoader;
  }): Promise<UserTable> {
    const user = await userQueries.create({
      knex: params.knex,
      newUser: params.newUser,
    });

    params.userDL.getLoader({ knex: params.knex }).prime(user.id, user);

    return user;
  },
};
