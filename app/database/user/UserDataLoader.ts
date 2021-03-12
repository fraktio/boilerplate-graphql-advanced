import DataLoader from "dataloader";

import { userDB, UserID, UserTable } from "./userDatabase";

import {
  AbstractDataLoaderBase,
  DataLoaderParams,
} from "~/database/AbstractDataLoader";

export type UserLoader = DataLoader<UserID, UserTable | null>;

export class UserDataLoader extends AbstractDataLoaderBase<UserLoader> {
  protected createLoader(params: DataLoaderParams): UserLoader {
    const userLoader: UserLoader = new DataLoader(async (ids) => {
      const users = await userDB.getUsersByIds({
        knex: params.knex,
        userIds: ids,
      });

      return ids.map((id) => users.find((user) => user.id === id) || null);
    });

    return userLoader;
  }
}
