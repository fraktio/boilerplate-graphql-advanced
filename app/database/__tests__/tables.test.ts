import { createUUID, Table, tableColumn } from "~/database/tables";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("database tests / tables", () => {
  it("createUUID", async () => {
    const uuid = createUUID().toString();

    expect(uuidRegex.test(uuid)).toBeTruthy();
  });

  it("tableColumn", async () => {
    const column = tableColumn(Table.COMPANY, "id");

    expect(column).toBe("company.id");
  });
});
