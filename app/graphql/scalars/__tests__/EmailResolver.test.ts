import { StringValueNode } from "graphql";

import { EmailResolver } from "~/graphql/scalars/EmailResolver";

const email = "testuser@domain.com";

describe("graphql scalars / Email", () => {
  it("Name", async () => {
    expect(EmailResolver.name).toBe("Email");
  });

  it("Description", async () => {
    expect(EmailResolver.description).toBe("Email custom scalar type");
  });

  it("serialize", async () => {
    expect(EmailResolver.serialize(email)).toBe(email);
  });

  it("parseValue", async () => {
    expect(EmailResolver.parseValue(email).toString()).toBe(email);
  });

  it("parseLiteral", async () => {
    const node: StringValueNode = {
      kind: "StringValue",
      value: email,
    };

    expect(EmailResolver.parseLiteral(node, {}).toString()).toBe(email);
  });
});
