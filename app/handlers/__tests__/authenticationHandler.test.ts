import { authenticatedUserHandler } from "../authenticationHandlers";

import { createFakeUserTable } from "~/database/company/__tests__/companyDatabase.test";

describe("authenticationHandlers tests", () => {
  it("authenticatedUserHandler", async () => {
    const fakeUser = createFakeUserTable();

    const result = await authenticatedUserHandler({
      authenticatedUser: fakeUser,
    });

    expect(result).toMatchObject(fakeUser);
  });
});
