import faker from "faker";
import { FinnishSSN } from "finnish-ssn";
import { Knex } from "knex";
import { CountryCode } from "libphonenumber-js";

import { PersonTableRow } from "../app/database/person/personDatabase";
import { createUUID, Table } from "../app/database/tables";

import { doXTimes } from "./1-users";

import { EmailAddress } from "~/generation/scalars";

const createPerson = (): Omit<
  PersonTableRow,
  "id" | "createdAt" | "updatedAt"
> => ({
  uuid: createUUID(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phone: faker.phone.phoneNumber("+35840#######"),
  email: (faker.internet.email() as unknown) as EmailAddress,
  birthday: faker.date.past(),
  nationality: (faker.address.countryCode() as unknown) as CountryCode,
  personalIdentityCode: FinnishSSN.createWithAge(
    faker.random.number({
      min: 15,
      max: 65,
    }),
  ),
});

export async function seed(knex: Knex): Promise<void> {
  const persons = doXTimes(1225).map(createPerson);

  await knex(Table.PERSONS).insert<PersonTableRow>(persons);
}
