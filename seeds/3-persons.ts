import faker from "faker";
import { Knex } from "knex";

import { PersonTableRow } from "../app/database/person/personDatabase";
import { createUUID, Table } from "../app/database/tables";

import { doXTimes } from "./1-users";

const createPerson = (): Omit<
  PersonTableRow,
  "id" | "createdAt" | "updatedAt"
> => ({
  uuid: createUUID(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phone: faker.phone.phoneNumber("+35840#######"),
  email: faker.internet.email(),
  birthday: faker.date.past(),
});

export async function seed(knex: Knex): Promise<void> {
  const persons = doXTimes(1225).map(createPerson);

  await knex(Table.PERSONS).insert<PersonTableRow>(persons);
}
