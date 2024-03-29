import { Knex } from "knex";

import { Table } from "~/database/tables";

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Table.EMPLOYEE).del();
  await knex(Table.PERSONS).del();
  await knex(Table.COMPANY).del();
  await knex(Table.USERS).del();
};
