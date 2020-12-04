import * as Knex from "knex";

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
      table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    })
    .createTable("movies", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.text("title").notNullable();
      table.integer("rating").notNullable();
      table.timestamp("releaseDate").notNullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    })
    .createTable("genres", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.text("type").notNullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    })
    .createTable("movieGenreRelation", (table) => {
      table.increments("id").primary().notNullable();
      table.integer("movieId").notNullable().references("movies.id");
      table.integer("genreId").notNullable().references("genres.id");
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    })
    .createTable("persons", (table) => {
      table.increments("id").primary().notNullable();
      table.uuid("uuid").notNullable();
      table.text("firstName").notNullable();
      table.text("familyName").notNullable();
      table.timestamp("birthday").notNullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    })
    .createTable("cast", (table) => {
      table.increments("id").primary().notNullable();
      table.integer("movieId").notNullable().references("movies.id");
      table.integer("personId").notNullable().references("persons.id");
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("movieGenreRelation")
    .dropTableIfExists("cast")
    .dropTableIfExists("users")
    .dropTableIfExists("movies")
    .dropTableIfExists("genres")
    .dropTableIfExists("persons")
    .raw("DROP EXTENSION IF EXISTS btree_gist;");
}
