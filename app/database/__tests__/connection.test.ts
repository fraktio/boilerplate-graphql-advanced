import { getConnection } from "../connection";

import { DatabaseConfig } from "~/config/databaseConfig";

describe("database tests / connection", () => {
  it("createUUID", async () => {
    const databaseConfig: DatabaseConfig = {
      type: "type",
      host: "host",
      user: "user",
      port: 5432,
      password: "password",
      databaseName: "databaseName",
    };

    const result = getConnection({ databaseConfig });

    expect(result).toMatchSnapshot();
  });
});
