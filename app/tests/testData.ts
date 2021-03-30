import faker from "faker";
import { parsePhoneNumber } from "libphonenumber-js";
import { v4 as uuidv4 } from "uuid";

import { EmailAddress } from "~/generation/scalars";

export const testUsername = "username";
export const testPassword = "password";

export const doXTimes = (count: number) => [...Array(count).keys()];

type CreateUserParams = {
  username?: string;
  hashedPassword: string;
};

export const createUser = (params: CreateUserParams) => ({
  uuid: uuidv4(),
  username: params?.username || faker.internet.userName(),
  email: (faker.internet.email() as unknown) as EmailAddress,
  phoneNumber: parsePhoneNumber(faker.phone.phoneNumber("+358#########")),
  hashedPassword: params?.hashedPassword,
});

export const createUserRegistration = () => ({
  username: testUsername,
  password: testPassword,
  email: "email@testmail.com",
  phoneNumber: "+358400000000",
});

export const createCompany = () => ({
  uuid: uuidv4(),
  name: faker.company.companyName(),
});
