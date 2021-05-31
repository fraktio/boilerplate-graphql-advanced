import faker from "faker";
import { StringValueNode } from "graphql";
import { parsePhoneNumber } from "libphonenumber-js";

import { PhoneNumberResolver } from "~/graphql/scalars/PhoneNumberResolver";

const phoneNumberString = faker.phone.phoneNumber("+358#########");
const phoneNumber = parsePhoneNumber(phoneNumberString);
const phoneNumberFormatted = phoneNumber.formatInternational();

describe("graphql scalars / PhoneResolver", () => {
  it("Name", async () => {
    expect(PhoneNumberResolver.name).toBe("Phone");
  });

  it("Description", async () => {
    expect(PhoneNumberResolver.description).toBe("Phone scalar type");
  });

  it("serialize", async () => {
    expect(PhoneNumberResolver.serialize(phoneNumber)).toBe(
      phoneNumberFormatted,
    );
  });

  it("parseValue", async () => {
    const pn = PhoneNumberResolver.parseValue(phoneNumberFormatted);
    expect(pn.formatInternational()).toBe(phoneNumberFormatted);
  });

  it("parseLiteral", async () => {
    const node: StringValueNode = {
      kind: "StringValue",
      value: phoneNumberFormatted,
    };

    const pn = PhoneNumberResolver.parseLiteral(node, {});
    expect(pn.formatInternational()).toBe(phoneNumberFormatted);
  });
});
