import { createFakeUserTable } from "~/database/company/__tests__/companyQueries.test";
import { authenticatedUserHandler } from "~/handlers/authenticationHandlers";

describe("authenticationHandlers tests", () => {
  it("authenticatedUserHandler", async () => {
    const fakeUser = createFakeUserTable();

    const result = await authenticatedUserHandler({
      authenticatedUser: fakeUser,
    });

    expect(result).toMatchObject(fakeUser);
  });
});
