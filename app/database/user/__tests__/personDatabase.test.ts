import {
  formatUserRow,
  UserID,
  UserTable,
  UserTableRow,
} from "../userDatabase";

import { UUID } from "~/generation/mappers";

const datetimeString =
  "Fri Mar 12 2021 13:16:56 GMT+0200 (Eastern European Standard Time)";

export const dbPersonMockTableRow: UserTableRow = {
  id: (2 as unknown) as UserID,
  uuid: ("valid-uuid" as unknown) as UUID,
  username: "username",
  email: "email",
  phoneNumber: "+358400000000",
  hashedPassword: "valid-hashed-password",
  createdAt: new Date(datetimeString),
  updatedAt: null,
};

export const dbPersonMockTableRowUpdated: UserTableRow = {
  ...dbPersonMockTableRow,
  updatedAt: new Date(datetimeString),
};

export const createFakeUserTable = (person = dbPersonMockTableRow): UserTable =>
  formatUserRow(person);

describe("database tests / user", () => {
  it("formatUserRow", async () => {
    const result = formatUserRow(dbPersonMockTableRow);

    expect(result).toMatchSnapshot();
  });

  it("formatUserRow updated", async () => {
    const result = formatUserRow(dbPersonMockTableRowUpdated);

    expect(result).toMatchSnapshot();
  });
});
