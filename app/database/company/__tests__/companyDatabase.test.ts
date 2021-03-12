import {
  formatUserRow,
  UserID,
  UserTable,
  UserTableRow,
} from "~/database/user/userDatabase";
import { UUID } from "~/graphql/generation/mappers";

const datetimeString =
  "Fri Mar 12 2021 13:16:56 GMT+0200 (Eastern European Standard Time)";

export const dbUserMockTableRow: UserTableRow = {
  id: (2 as unknown) as UserID,
  uuid: ("valid-uuid" as unknown) as UUID,
  username: "username",
  email: "email",
  phoneNumber: "valid-phonenumber",
  hashedPassword: "valid-hashed-password",
  createdAt: new Date(datetimeString),
  updatedAt: null,
};

export const dbUserMockTableRowUpdated: UserTableRow = {
  ...dbUserMockTableRow,
  updatedAt: new Date(datetimeString),
};

export const createFakeUserTable = (): UserTable =>
  formatUserRow(dbUserMockTableRow);

describe("database tests / company", () => {
  it("formatUserRow", async () => {
    const result = formatUserRow(dbUserMockTableRow);

    expect(result).toMatchSnapshot();
  });

  it("formatUserRow updated", async () => {
    const result = formatUserRow(dbUserMockTableRowUpdated);

    expect(result).toMatchSnapshot();
  });
});
