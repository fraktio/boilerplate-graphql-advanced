import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("person", (table) => {
    table.text("personalIdentityCode").unique().notNullable();
    table.text("nationality").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("person", (table) => {
    table.dropColumn("nationality");
    table.dropColumn("personalIdentityCode");
  });
}
