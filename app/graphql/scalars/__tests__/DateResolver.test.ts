import { StringValueNode } from "graphql";
import { DateTime } from "luxon";

import { DateResolver } from "../DateResolver";

const presetDateString = "2000-01-20";
const presetDate = DateTime.fromFormat(presetDateString, "yyyy-MM-dd", {
  zone: "utc",
});
const presetDateFormatted = presetDate.toString();

describe("graphql scalars / Date", () => {
  it("Name", async () => {
    expect(DateResolver.name).toBe("Date");
  });

  it("Description", async () => {
    expect(DateResolver.description).toBe("Date without time or timezone");
  });

  it("serialize", async () => {
    expect(DateResolver.serialize(presetDate)).toBe(presetDateString);
  });

  it("parseValue", async () => {
    expect(DateResolver.parseValue(presetDateString).toString()).toBe(
      presetDateFormatted,
    );
  });

  it("parseLiteral", async () => {
    const node: StringValueNode = {
      kind: "StringValue",
      value: presetDateString,
    };

    expect(DateResolver.parseLiteral(node, {}).toString()).toBe(
      presetDateFormatted,
    );
  });
});
