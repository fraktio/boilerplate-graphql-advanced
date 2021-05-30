import { PhoneNumber } from "libphonenumber-js";

import { DBConnection } from "~/database/connection";
import { UserDataLoader } from "~/database/user/UserDataLoader";
import { userDB } from "~/database/user/userDatabase";
import { EmailAddress } from "~/generation/scalars";
import { hashingUtils } from "~/utils/hashingUtils";
import { Try, toFailure, toSuccess } from "~/utils/validation";

type CreateUser = {
  username: string;
  email: EmailAddress;
  password: string;
  phoneNumber: PhoneNumber;
};

export enum RegisterHandlerErrors {
  UsernameAlreadyExists = "username-alreay-exists",
}

type RegisterHandler = Try<null, RegisterHandlerErrors>;

export const registerHandler = async (params: {
  knex: DBConnection;
  newUser: CreateUser;
  userDL: UserDataLoader;
}): Promise<RegisterHandler> => {
  const user = await userDB.getByUsername({
    knex: params.knex,
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
    knex: params.knex,
    newUser: {
      username: params.newUser.username,
      email: params.newUser.email,
      hashedPassword,
      phoneNumber: params.newUser.phoneNumber,
    },
    userDL: params.userDL,
  });

  return toSuccess(null);
};
