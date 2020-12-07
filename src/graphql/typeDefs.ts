// import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "apollo-server";
// import path from "path";

const authDefs = gql`
  type Session {
    UUID: UUID
  }

  type Query {
    authenticatedUser: User! @authenticated
  }

  type LoginUserSuccess {
    user: User!
  }

  type LoginUserFailure {
    success: Boolean!
  }

  union LoginUserResponse = LoginUserSuccess | LoginUserFailure

  input LoginUserInput {
    username: String!
    password: String!
  }

  type Mutation {
    login(input: LoginUserInput!): LoginUserResponse!
    logout: Boolean!
  }
`;

const companyDefs = gql`
  type Company {
    UUID: UUID!
    name: String!
    timestamp: Timestamp!
    employees: [Adult!]!
  }

  input CompanyQuery {
    UUID: UUID!
  }

  type Query {
    companies: [Company!]!
    company(input: CompanyQuery!): Company!
  }

  type Mutation {
    addCompany(input: AddCompanyInput!): AddCompanyOutput!
    editCompany(input: EditCompanyInput!): EditCompanyOutput!
  }

  input AddCompanyInput {
    company: CompanyInput!
  }

  input EditCompanyInput {
    UUID: UUID!
    company: CompanyInput!
  }

  input CompanyInput {
    name: String!
    # more later..
  }

  union AddCompanyOutput = AddCompanySuccess | UniqueConstraintViolationFailure

  type AddCompanySuccess {
    company: Company!
  }

  union EditCompanyOutput = EditCompanySuccess #| possible other failures
  type EditCompanySuccess {
    company: Company!
  }
`;

const employeeDefs = gql`
  type Mutation {
    addEmployee(input: AddEmployeeInput!): AddEmployeeOutput!
    removeEmployee(input: RemoveEmployeeInput!): RemoveEmployeeOutput!
  }

  input AddEmployeeInput {
    companyUUID: UUID!
    personUUID: UUID!
  }

  input RemoveEmployeeInput {
    companyUUID: UUID!
    personUUID: UUID!
  }

  union AddEmployeeOutput = AddEmployeeSuccess #| possible other failures
  type AddEmployeeSuccess {
    company: Company!
  }

  union RemoveEmployeeOutput = RemoveEmployeeSuccess #| possible other failures
  type RemoveEmployeeSuccess {
    company: Company!
  }
`;

const failureDefs = gql`
  interface FailureOutput {
    message: String!
    field: String!
  }

  "Operation fails because some value is not unique"
  type UniqueConstraintViolationFailure implements FailureOutput {
    message: String!
    field: String!
  }
`;

const filterDefs = gql`
  input TimeFilter {
    equal: DateTime
    notEqual: DateTime
    lessThan: DateTime
    lessOrEqualThan: DateTime
    greaterThan: DateTime
    greaterOrEqualThan: DateTime
  }

  input DateFilter {
    equal: Date
    notEqual: Date
    lessThan: Date
    lessOrEqualThan: Date
    greaterThan: Date
    greaterOrEqualThan: Date
  }
`;

const genericDefs = gql`
  scalar Date
  scalar DateTime
  scalar Hour
  scalar PhoneNumber
  scalar EmailAddress
  scalar UUID
  scalar HexColorCode
  scalar PersonalIdentityCode
  scalar Language
  scalar CountryCode

  directive @authenticated on FIELD_DEFINITION
  directive @upper on FIELD_DEFINITION
  directive @deprecated(
    reason: String = "This field is deprecated"
  ) on FIELD_DEFINITION | ENUM_VALUE

  type Timestamp {
    createdAt: DateTime!
    modifiedAt: DateTime
  }
`;

const personDefs = gql`
  interface Person {
    "Requires authentication and ADMIN privileges"
    UUID: UUID!
    firstName: String!
    lastName: String!
    personalIdentityCode: PersonalIdentityCode! # TODO: @auth(requires: ADMIN)
    phone: PhoneNumber
    email: EmailAddress!
    nationality: CountryCode!
    languages: [Language!]!
    birthday: Date!
    timestamp: Timestamp!
  }

  """
  Adult is over 16 years old Person
  """
  type Adult implements Person {
    "Requires authentication and ADMIN privileges"
    UUID: UUID!
    firstName: String!
    lastName: String!
    personalIdentityCode: PersonalIdentityCode!
    phone: PhoneNumber
    email: EmailAddress!
    nationality: CountryCode!
    languages: [Language!]!
    birthday: Date!
    timestamp: Timestamp!
    employers: [Company!]!
  }

  """
  Underage is under 16 years old Person
  """
  type Underage implements Person {
    "Requires authentication and ADMIN privileges"
    UUID: UUID!
    firstName: String!
    lastName: String!
    personalIdentityCode: PersonalIdentityCode!
    phone: PhoneNumber
    email: EmailAddress!
    nationality: CountryCode!
    languages: [Language!]!
    birthday: Date!
    timestamp: Timestamp!
  }

  type Query {
    persons(filter: PersonFilter): [Person]! @authenticated
    person(input: PersonInput!): Person!
  }

  input PersonInput {
    UUID: UUID!
  }

  type Subscription {
    personAdded: Person!
  }

  type Mutation {
    addPerson(input: AddPersonInput!): AddPersonOutput!
    editPerson(input: EditPersonInput!): EditPersonOutput!
  }

  input AddPersonPersonInput {
    firstName: String!
    lastName: String!
    personalIdentityCode: PersonalIdentityCode!
    phone: PhoneNumber
    email: EmailAddress!
    nationality: CountryCode!
    languages: [Language!]!
    birthday: Date!
  }

  input AddPersonInput {
    person: AddPersonPersonInput!
  }

  union AddPersonOutput = AddPersonSuccess | UniqueConstraintViolationFailure

  type AddPersonSuccess {
    person: Person!
  }

  input EditPersonInput {
    UUID: UUID!
    person: AddPersonPersonInput!
  }

  union EditPersonOutput = EditPersonSuccess # | possible failure
  type EditPersonSuccess {
    person: Person!
  }

  input PersonFilter {
    birthdayFilter: DateFilter
  }
`;

const registrationDefs = gql`
  type RegisterSuccess {
    success: Boolean!
  }

  type RegisterFailure {
    success: Boolean!
  }

  type RegisterFailureAlreadyExists {
    success: Boolean!
  }

  union RegisterResponse =
      RegisterSuccess
    | RegisterFailure
    | RegisterFailureAlreadyExists

  input RegisterInput {
    username: String!
    password: String!
    email: EmailAddress!
    phoneNumber: PhoneNumber!
  }

  type Mutation {
    register(input: RegisterInput!): RegisterResponse!
  }
`;

const userDefs = gql`
  type User {
    UUID: UUID!
    username: String!
  }
`;

// const typesArray = loadFilesSync(path.join(__dirname, "./schema"));
const typesArray = [
  authDefs,
  companyDefs,
  employeeDefs,
  failureDefs,
  filterDefs,
  genericDefs,
  personDefs,
  registrationDefs,
  userDefs,
];

export const typeDefs = mergeTypeDefs(typesArray);
