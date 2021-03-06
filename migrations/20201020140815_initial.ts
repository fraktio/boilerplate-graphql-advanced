import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw("CREATE EXTENSION btree_gist;")
    .createTable("users", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.text("username").notNullable();
      table.text("email").notNullable();
      table.text("phoneNumber").notNullable();
      table.text("hashedPassword").notNullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").nullable();
    })
    .createTable("company", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.text("name").notNullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").nullable();
    })
    .createTable("person", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.text("firstName").notNullable();
      table.text("lastName").notNullable();
      table.text("personalIdentityCode").notNullable();
      table.text("phone").notNullable();
      table.text("email").notNullable();
      table.text("nationality").notNullable();
      table.timestamp("birthday").notNullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").nullable();
    })
    .createTable("employee", (table) => {
      table.increments("id").primary().notNullable();
      table.integer("companyId").notNullable().references("company.id");
      table.integer("personId").notNullable().references("person.id");
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("employee")
    .dropTableIfExists("users")
    .dropTableIfExists("company")
    .dropTableIfExists("person")
    .raw("DROP EXTENSION IF EXISTS btree_gist;");
}
