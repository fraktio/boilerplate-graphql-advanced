import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("person", (table) => {
    table.enu("gender", ["MALE", "FEMALE", "OTHER"]).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("person", (table) => {
    table.dropColumn("gender");
  });
}
