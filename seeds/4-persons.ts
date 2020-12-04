import * as Knex from "knex";
import { v4 as uuidv4 } from "uuid";

import { PersonTableRaw } from "../src/dataSources/PersonDataSource";
import { Table } from "../src/database/types";

import { seedPersons } from "./seedData";

export async function seed(knex: Knex): Promise<void> {
  const persons = Object.values(seedPersons).map((seedPerson) => ({
    uuid: uuidv4(),
    firstName: seedPerson.firstName,
    familyName: seedPerson.familyName,
    birthday: seedPerson.birthday,
  }));

  await knex<PersonTableRaw>(Table.PERSONS).insert(persons);
}
