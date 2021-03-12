import { DBConnection } from "~/database/connection";
import { UserDataLoader } from "~/database/user/UserDataLoader";
import { userDS } from "~/database/user/UserDataSource";
import { hashingUtils } from "~/utils/hashingUtils";
import { toFailure, toSuccess } from "~/utils/validation/common";

type CreateUser = {
  username: string;
  email: string;
  password: string;
  phoneNumber: libphonenumber.PhoneNumber;
};

export enum RegisterHandlerErrors {
  UsernameAlreadyExists = "username-alreay-exists",
}

export const registerHandler = async (params: {
  knex: DBConnection;
  newUser: CreateUser;
  userDL: UserDataLoader;
}) => {
  const user = await userDS.getByUsername({
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

  await userDS.createUser({
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
