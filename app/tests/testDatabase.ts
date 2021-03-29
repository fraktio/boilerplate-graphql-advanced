import { DBConnection } from "~/database/connection";
import { Table } from "~/database/tables";

export const migrateTestDatabase = async (params: { knex: DBConnection }) => {
  await params.knex.migrate.latest();
};

export const resetTestDatabase = async ({ knex }: { knex: DBConnection }) => {
  await knex(Table.EMPLOYEE).del();
  await knex(Table.PERSONS).del();
  await knex(Table.COMPANY).del();
  await knex(Table.USERS).del();
};
