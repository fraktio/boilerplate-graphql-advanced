import faker from "faker";
import { FinnishSSN } from "finnish-ssn";
import { Knex } from "knex";

// eslint-disable-next-line no-restricted-imports
import { doXTimes } from "./1-users";

import { PersonTableRow } from "~/database/person/personQueries";
import { createUUID, Table } from "~/database/tables";
import {
  CountryCode,
  EmailAddress,
  FinnishPersonalIdentityCode,
} from "~/generation/scalars";

const createValidSsn = (): string => {
  const ssn = FinnishSSN.createWithAge(
    faker.datatype.number({
      min: 15,
      max: 65,
    }),
  );
  // Create tends to also create invalid SSN:s
  if (!FinnishSSN.validate(ssn)) {
    return createValidSsn();
  }

  return ssn;
};

const createPerson = (): Omit<
  PersonTableRow,
  "id" | "createdAt" | "updatedAt"
> => {
  const ssn = createValidSsn();

  FinnishSSN.validate(ssn);

  const parsedssn = FinnishSSN.parse(ssn);

  return {
    uuid: createUUID(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.phoneNumber("+35840#######"),
    email: faker.internet.email() as unknown as EmailAddress,
    birthday: parsedssn.dateOfBirth,
    nationality: faker.address.countryCode() as unknown as CountryCode,
    personalIdentityCode: ssn as unknown as FinnishPersonalIdentityCode,
  };
};

export async function seed(knex: Knex): Promise<void> {
  const persons = doXTimes(1225).map(createPerson);

  await knex(Table.PERSONS).insert<PersonTableRow>(persons);
}
