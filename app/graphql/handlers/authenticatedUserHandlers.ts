import { UserTable } from "~/dataSources/user/userDatabase";

export const authenticatedUserHandler = async (params: {
  authenticatedUser: UserTable;
}) => params.authenticatedUser;
