import { PhoneNumber } from "libphonenumber-js";

import { DBSession, withTransaction } from "~/database/connection";
import { UserDataLoader } from "~/database/user/UserDataLoader";
import { userDB } from "~/database/user/userDatabase";
import { EmailAddress } from "~/generation/scalars";
import { Logger } from "~/logger";
import { hashingUtils } from "~/utils/hashingUtils";
import { Try, toFailure, toSuccess } from "~/utils/validation";

type CreateUser = {
  username: string;
  email: EmailAddress;
  password: string;
  phoneNumber: PhoneNumber;
};

export enum RegisterHandlerErrors {
  TransactionError = "transaction-error",
  UsernameAlreadyExists = "username-alreay-exists",
}

export const registerHandler = async (params: {
  knex: DBSession;
  newUser: CreateUser;
  userDL: UserDataLoader;
  logger: Logger;
}): Promise<Try<null, RegisterHandlerErrors>> => {
  const result = await withTransaction(
    { knex: params.knex, logger: params.logger },
    async ({ transaction }) => {
      const user = await userDB.getByUsername({
        knex: transaction,
        username: params.newUser.username,
        userDL: params.userDL,
      });

      if (user) {
        return toFailure(RegisterHandlerErrors.UsernameAlreadyExists);
      }

      const hashedPassword = await hashingUtils.hashPassword({
        password: params.newUser.password,
      });

      await userDB.createUser({
        knex: transaction,
        newUser: {
          username: params.newUser.username,
          email: params.newUser.email,
          hashedPassword,
          phoneNumber: params.newUser.phoneNumber,
        },
        userDL: params.userDL,
      });

      return toSuccess(null);
    },
  );

  if (result.success) {
    return result.value;
  }

  return toFailure(RegisterHandlerErrors.TransactionError);
};
