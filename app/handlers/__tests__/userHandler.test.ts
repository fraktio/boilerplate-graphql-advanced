import { authenticatedUserHandler } from "../userHandlers";

import { createFakeUserTable } from "~/database/company/__tests__/companyDatabase.test";

describe("userHandlers tests", () => {
  it("authenticatedUserHandler", async () => {
    const fakeUser = createFakeUserTable();

    const result = await authenticatedUserHandler({
      authenticatedUser: fakeUser,
    });

    expect(result).toMatchObject(fakeUser);
  });
});
