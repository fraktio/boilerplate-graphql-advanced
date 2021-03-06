import faker from "faker";
import { v4 as uuidv4 } from "uuid";

import { doXTimes } from "./1-users";

import { PersonTableRow } from "~/database/person/personDatabase";
import { Table } from "~/database/tables";
import { Knex } from "knex";

const createPerson = () => ({
  uuid: uuidv4(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  personalIdentityCode: faker.random.uuid(),
  phone: faker.phone.phoneNumber("+35840#######"),
  email: faker.internet.email(),
  nationality: faker.address.countryCode(),
  birthday: faker.date.past(),
});

export async function seed(knex: Knex): Promise<void> {
  const persons = doXTimes(1225).map(createPerson);

  await knex(Table.PERSONS).insert<PersonTableRow>(persons);
}
