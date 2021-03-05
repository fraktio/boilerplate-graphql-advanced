import { DBConnection } from "~/database/connection";
import { userDB, UserID } from "~/database/userDB";

export const userDS = {
  async get(params: { knex: DBConnection; userId: UserID }) {
    const user = userDB.get({ knex: params.knex, userId: params.userId });

    return user;
  },

  async getByUsername(params: { knex: DBConnection; username: string }) {
    const user = userDB.getByUsername({
      knex: params.knex,
      username: params.username,
    });

    return user;
  },
};
