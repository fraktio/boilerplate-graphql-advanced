import { PhoneNumber } from "libphonenumber-js";

import { Maybe } from "~/@types/global";
import { DBSession } from "~/database/connection";
import { UserDataLoader } from "~/database/user/UserDataLoader";
import { userQueries, UserID, UserTable } from "~/database/user/userQueries";
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
    knex: DBSession;
    userId: UserID;
    userDL: UserDataLoader;
  }): Promise<Maybe<UserTable>> {
    const user = await userQueries.get({
      knex: params.knex,
      userId: params.userId,
    });

    if (user) {
      params.userDL
        .getLoader({ knex: params.knex })
        .prime(user.internalId, user);
    }

    return user;
  },

  async getByUsername(params: {
    knex: DBSession;
    username: string;
    userDL: UserDataLoader;
  }): Promise<Maybe<UserTable>> {
    const user = await userQueries.getByUsername({
      knex: params.knex,
      username: params.username,
    });

    if (user) {
      params.userDL
        .getLoader({ knex: params.knex })
        .prime(user.internalId, user);
    }

    return user;
  },

  async getByUUID(params: {
    knex: DBSession;
    userUUID: UUID;
    userDL: UserDataLoader;
  }): Promise<Maybe<UserTable>> {
    const user = await userQueries.getByUUID({
      knex: params.knex,
      userUUID: params.userUUID,
    });

    if (user) {
      params.userDL
        .getLoader({ knex: params.knex })
        .prime(user.internalId, user);
    }

    return user;
  },

  async createUser(params: {
    knex: DBSession;
    newUser: CreateUser;
    userDL: UserDataLoader;
  }): Promise<UserTable> {
    const user = await userQueries.create({
      knex: params.knex,
      newUser: params.newUser,
    });

    params.userDL.getLoader({ knex: params.knex }).prime(user.internalId, user);

    return user;
  },
};
