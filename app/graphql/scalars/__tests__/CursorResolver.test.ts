import { StringValueNode } from "graphql";

import { Cursor, CursorResolver } from "~/graphql/scalars/CursorResolver";
import { hashingUtils } from "~/utils/hashingUtils";

const mockCursor: Cursor = {
  page: 1,
  perPage: 1,
  offset: 1,
};

const cursorString = JSON.stringify(mockCursor);

const base64Cursor = hashingUtils.stringToBase64(cursorString);

describe("graphql scalars / Cursor", () => {
  it("Name", async () => {
    expect(CursorResolver.name).toBe("Cursor");
  });

  it("Description", async () => {
    expect(CursorResolver.description).toBe("Cursor for pagination pages");
  });

  it("serialize", async () => {
    expect(CursorResolver.serialize(mockCursor)).toBe(base64Cursor);
  });

  describe("parseValue", () => {
    it("success", async () => {
      expect(CursorResolver.parseValue(base64Cursor)).toMatchObject(mockCursor);
    });

    it("failure, bad cursor", async () => {
      const badCursorFn = (): void => {
        CursorResolver.parseValue({ bad: "bad" });
      };
      expect(badCursorFn).toThrow("Cursor is not a valid cursor");
    });
  });

  it("parseValue", async () => {
    expect(CursorResolver.parseValue(base64Cursor)).toMatchObject(mockCursor);
  });

  describe("parseLiteral", () => {
    it("success", async () => {
      const node: StringValueNode = {
        kind: "StringValue",
        value: base64Cursor,
      };

      expect(CursorResolver.parseLiteral(node, {})).toMatchObject(mockCursor);
    });

    it("failure, bad cursor", async () => {
      const node: StringValueNode = {
        kind: "StringValue",
        value: "bad",
      };

      const badCursorFn = (): void => {
        expect(CursorResolver.parseLiteral(node, {}));
      };
      expect(badCursorFn).toThrow("Cursor is not a valid cursor");
    });
  });
});
