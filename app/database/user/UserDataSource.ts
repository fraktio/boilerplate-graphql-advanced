import { PhoneNumber } from "libphonenumber-js";

import { UserDataLoader } from "./UserDataLoader";

import { DBConnection } from "~/database/connection";
import { userDB, UserID } from "~/database/user/userDatabase";
import { UUID } from "~/generation/mappers";

export type CreateUser = {
  username: string;
  email: string;
  hashedPassword: string;
  phoneNumber: PhoneNumber;
};

export const userDS = {
  async get(params: {
    knex: DBConnection;
    userId: UserID;
    userDL: UserDataLoader;
  }) {
    const user = await userDB.get({ knex: params.knex, userId: params.userId });

    if (user) {
      params.userDL.getLoader({ knex: params.knex }).prime(user.id, user);
    }

    return user;
  },

  async getByUsername(params: {
    knex: DBConnection;
    username: string;
    userDL: UserDataLoader;
  }) {
    const user = await userDB.getByUsername({
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
  }) {
    const user = await userDB.getByUUID({
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
  }) {
    const user = await userDB.create({
      knex: params.knex,
      newUser: params.newUser,
    });

    params.userDL.getLoader({ knex: params.knex }).prime(user.id, user);

    return user;
  },
};
