import {
  formatUserRow,
  UserID,
  UserTable,
  UserTableRow,
} from "~/database/user/userQueries";
import { UUID } from "~/generation/mappers";
import { EmailAddress } from "~/generation/scalars";

const datetimeString =
  "Fri Mar 12 2021 13:16:56 GMT+0200 (Eastern European Standard Time)";

export const dbUserMockTableRow: UserTableRow = {
  id: 2 as unknown as UserID,
  uuid: "valid-uuid" as unknown as UUID,
  username: "username",
  email: "email" as unknown as EmailAddress,
  phoneNumber: "+358400000000",
  hashedPassword: "valid-hashed-password",
  createdAt: new Date(datetimeString),
  updatedAt: null,
};

export const dbUserMockTableRowUpdated: UserTableRow = {
  ...dbUserMockTableRow,
  updatedAt: new Date(datetimeString),
};

export const createFakeUserTable = (user = dbUserMockTableRow): UserTable =>
  formatUserRow(user);

describe("database tests / user", () => {
  it("formatUserRow", async () => {
    const result = formatUserRow(dbUserMockTableRow);

    expect(result).toMatchSnapshot();
  });

  it("formatUserRow updated", async () => {
    const result = formatUserRow(dbUserMockTableRowUpdated);

    expect(result).toMatchSnapshot();
  });
});
