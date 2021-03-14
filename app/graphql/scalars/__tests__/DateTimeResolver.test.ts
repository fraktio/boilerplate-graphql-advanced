import { StringValueNode } from "graphql";
import { DateTime } from "luxon";

import { DateTimeResolver } from "../DateTimeResolver";

const presetDateTimeString = "2021-03-14T02:49:03.095Z";
const presetDateTime = DateTime.fromISO(presetDateTimeString);
const presetDateFormatted = presetDateTime.toISO();

describe("graphql scalars / Date", () => {
  it("Name", async () => {
    expect(DateTimeResolver.name).toBe("DateTime");
  });

  it("Description", async () => {
    expect(DateTimeResolver.description).toBe("Date and time with offset");
  });

  it("serialize", async () => {
    expect(DateTimeResolver.serialize(presetDateTime)).toBe(
      presetDateFormatted,
    );
  });

  it("parseValue", async () => {
    expect(DateTimeResolver.parseValue(presetDateTimeString).toString()).toBe(
      presetDateFormatted,
    );
  });

  it("parseLiteral", async () => {
    const node: StringValueNode = {
      kind: "StringValue",
      value: presetDateTimeString,
    };

    expect(DateTimeResolver.parseLiteral(node, {}).toString()).toBe(
      presetDateFormatted,
    );
  });
});
