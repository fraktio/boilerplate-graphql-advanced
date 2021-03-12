import { UserTable } from "~/database/user/userDatabase";

export const authenticatedUserHandler = async (params: {
  authenticatedUser: UserTable;
}) => params.authenticatedUser;
