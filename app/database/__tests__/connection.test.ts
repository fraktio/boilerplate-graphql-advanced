import { DatabaseConfig } from "~/config/configs/databaseConfig";
import { Platform } from "~/config/configs/platformConfig";
import { getConnection } from "~/database/connection";

describe("database tests / connection", () => {
  it("createUUID", async () => {
    const databaseConfig: DatabaseConfig = {
      type: "pg",
      host: "host",
      user: "user",
      port: 5432,
      password: "password",
      databaseName: "databaseName",
    };

    const result = getConnection({
      databaseConfig,
      platformConfig: { type: Platform.Local },
    });

    expect(result).toMatchSnapshot();
  });
});
