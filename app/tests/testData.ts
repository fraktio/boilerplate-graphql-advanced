import faker from "faker";
import { parsePhoneNumber, PhoneNumber } from "libphonenumber-js";
import { v4 as uuidv4 } from "uuid";

import { EmailAddress } from "~/generation/scalars";

export const testUsername = "username";
export const testPassword = "password";

export const doXTimes = (count: number): number[] => [...Array(count).keys()];

type CreateUserParams = {
  username?: string;
  hashedPassword: string;
};

type MockUserData = {
  uuid: string;
  username: string;
  email: EmailAddress;
  phoneNumber: PhoneNumber;
  hashedPassword: string;
};

export const createUser = (params: CreateUserParams): MockUserData => ({
  uuid: uuidv4(),
  username: params?.username || faker.internet.userName(),
  email: faker.internet.email() as unknown as EmailAddress,
  phoneNumber: parsePhoneNumber(faker.phone.phoneNumber("+358#########")),
  hashedPassword: params?.hashedPassword,
});

type CreateUserRegistrationResponse = {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
};

export const createUserRegistration = (): CreateUserRegistrationResponse => ({
  username: testUsername,
  password: testPassword,
  email: faker.internet.email(),
  phoneNumber: faker.phone.phoneNumber("+358#########"),
});

type CreateCompanyResponse = {
  uuid: string;
  name: string;
};

export const createCompany = (): CreateCompanyResponse => ({
  uuid: uuidv4(),
  name: faker.company.companyName(),
});
