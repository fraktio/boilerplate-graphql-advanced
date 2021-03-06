import { DBConnection } from "~/database/connection";
import { userDB, UserID } from "~/database/user/userDatabase";
import { UUID } from "~/models";

export type CreateUser = {
  username: string;
  email: string;
  hashedPassword: string;
  phoneNumber: libphonenumber.PhoneNumber;
};

export const userDS = {
  async get(params: { knex: DBConnection; userId: UserID }) {
    return await userDB.get({ knex: params.knex, userId: params.userId });
  },

  async getByUsername(params: { knex: DBConnection; username: string }) {
    return await userDB.getByUsername({
      knex: params.knex,
      username: params.username,
    });
  },

  async getByUUID(params: { knex: DBConnection; userUUID: UUID }) {
    return await userDB.getByUUID({
      knex: params.knex,
      userUUID: params.userUUID,
    });
  },

  async createUser(params: { knex: DBConnection; newUser: CreateUser }) {
    return await userDB.create({
      knex: params.knex,
      newUser: params.newUser,
    });
  },
};
