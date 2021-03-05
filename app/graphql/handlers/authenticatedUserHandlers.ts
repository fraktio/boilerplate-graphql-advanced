import { UserTable } from "~/database/userDB";

export const authenticatedUserHandler = async (params: {
  authenticatedUser: UserTable;
}) => params.authenticatedUser;
