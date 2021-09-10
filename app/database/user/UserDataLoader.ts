import DataLoader from "dataloader";

import {
  AbstractDataLoaderBase,
  DataLoaderParams,
} from "~/database/AbstractDataLoader";
import { userQueries, UserID, UserTable } from "~/database/user/userQueries";
import { Maybe } from "~/generation/generated";

export type UserLoader = DataLoader<UserID, Maybe<UserTable>>;

export class UserDataLoader extends AbstractDataLoaderBase<UserLoader> {
  protected createLoader(params: DataLoaderParams): UserLoader {
    const userLoader: UserLoader = new DataLoader(async (ids) => {
      const users = await userQueries.getUsersByIds({
        knex: params.knex,
        userIds: ids,
      });

      return ids.map((id) => users.find((user) => user.id === id) || null);
    });

    return userLoader;
  }
}
