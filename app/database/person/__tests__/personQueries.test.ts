import {
  formatPersonRow,
  PersonID,
  PersonTable,
  PersonTableRow,
} from "~/database/person/personQueries";
import { UUID } from "~/generation/mappers";
import { EmailAddress } from "~/generation/scalars";

const datetimeString =
  "Fri Mar 12 2021 13:16:56 GMT+0200 (Eastern European Standard Time)";

export const dbPersonMockTableRow: PersonTableRow = {
  id: 2 as unknown as PersonID,
  uuid: "valid-uuid" as unknown as UUID,
  firstName: "firstname",
  lastName: "lastname",
  phone: "+358400000000",
  email: "valid-email" as unknown as EmailAddress,
  birthday: new Date(datetimeString),
  createdAt: new Date(datetimeString),
  updatedAt: null,
  nationality: "FI",
  personalIdentityCode: "230488-577C",
};

export const dbPersonMockTableRowUpdated: PersonTableRow = {
  ...dbPersonMockTableRow,
  updatedAt: new Date(datetimeString),
};

export const createFakeUserTable = (
  person = dbPersonMockTableRow,
): PersonTable => formatPersonRow(person);

describe("database tests / person", () => {
  it("formatPersonRow", async () => {
    const result = formatPersonRow(dbPersonMockTableRow);

    expect(result).toMatchSnapshot();
  });

  it("formatPersonRow updated", async () => {
    const result = formatPersonRow(dbPersonMockTableRowUpdated);

    expect(result).toMatchSnapshot();
  });
});
