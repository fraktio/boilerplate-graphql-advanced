import { CountryCode } from './scalars';
import { Cursor } from './scalars';
import { DateTime } from 'luxon';
import { EmailAddress } from './scalars';
import { FinnishPersonalIdentityCode } from './scalars';
import { PhoneNumber } from 'libphonenumber-js';
import { UUID } from './mappers';
import { Upload } from './scalars';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { CompanyModel, PersonModel, AdultModel, UserModel } from './mappers';
import { Context } from '../graphql/context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  CountryCode: CountryCode;
  Cursor: Cursor;
  Date: DateTime;
  DateTime: DateTime;
  EmailAddress: EmailAddress;
  PersonalIdentityCode: FinnishPersonalIdentityCode;
  PhoneNumber: PhoneNumber;
  UUID: UUID;
  Upload: Upload;
};

export enum AccessRight {
  Admin = 'ADMIN',
  User = 'USER'
}

export type AddCompanyInput = {
  company: CompanyInput;
};

export type AddCompanyOutput = AddCompanySuccess;

export type AddCompanySuccess = {
  __typename?: 'AddCompanySuccess';
  company: Company;
};

export type AddEmployeeInput = {
  companyId: Scalars['UUID'];
  personId: Scalars['UUID'];
};

export type AddEmployeeOutput = AddEmployeeSuccess;

export type AddEmployeeSuccess = {
  __typename?: 'AddEmployeeSuccess';
  company: Company;
};

export type AddPersonInput = {
  person: PersonInput;
};

export type AddPersonOutput = AddPersonSuccess | UniqueConstraintViolationFailure;

export type AddPersonSuccess = {
  __typename?: 'AddPersonSuccess';
  person: Person;
};

/** Adult is over 16 years old Person */
export type Adult = Person & {
  __typename?: 'Adult';
  birthday: Scalars['Date'];
  email: Scalars['EmailAddress'];
  employers: Array<Company>;
  firstName: Scalars['String'];
  gender: Gender;
  id: Scalars['UUID'];
  /** Requires authentication and ADMIN privileges */
  internalId: Scalars['ID'];
  lastName: Scalars['String'];
  nationality: Scalars['CountryCode'];
  /** Requires authentication and USER privileges */
  personalIdentityCode: Scalars['PersonalIdentityCode'];
  phone?: Maybe<Scalars['PhoneNumber']>;
  timestamp: Timestamp;
};

export type AuthenticatedUserFailure = {
  __typename?: 'AuthenticatedUserFailure';
  success: Scalars['Boolean'];
};

export type AuthenticatedUserResponse = AuthenticatedUserFailure | AuthenticatedUserSuccess;

export type AuthenticatedUserSuccess = {
  __typename?: 'AuthenticatedUserSuccess';
  user: User;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Company = {
  __typename?: 'Company';
  employees: Array<Adult>;
  id: Scalars['UUID'];
  name: Scalars['String'];
  timestamp: Timestamp;
};

export type CompanyFailureNotFound = {
  __typename?: 'CompanyFailureNotFound';
  success: Scalars['Boolean'];
};

export type CompanyFilterInput = {
  filterOperations?: Maybe<Array<CompanyFilterOperationInput>>;
  nameFilter?: Maybe<StringFilter>;
};

export type CompanyFilterOperationInput = {
  filters?: Maybe<Array<CompanyFilterInput>>;
  operator: FilterOperator;
};

export type CompanyInput = {
  name: Scalars['String'];
};

export type CompanyOutput = CompanyFailureNotFound | CompanySuccess;

export type CompanyQuery = {
  id: Scalars['UUID'];
};

export type CompanySuccess = {
  __typename?: 'CompanySuccess';
  company: Company;
};

export type DateFilter = {
  equal?: Maybe<Scalars['Date']>;
  greaterOrEqualThan?: Maybe<Scalars['Date']>;
  greaterThan?: Maybe<Scalars['Date']>;
  lessOrEqualThan?: Maybe<Scalars['Date']>;
  lessThan?: Maybe<Scalars['Date']>;
  notEqual?: Maybe<Scalars['Date']>;
};

export type EditCompanyFailureNotFound = {
  __typename?: 'EditCompanyFailureNotFound';
  success?: Maybe<Scalars['Boolean']>;
};

export type EditCompanyInput = {
  company: CompanyInput;
  id: Scalars['UUID'];
};

export type EditCompanyOutput = EditCompanyFailureNotFound | EditCompanySuccess;

export type EditCompanySuccess = {
  __typename?: 'EditCompanySuccess';
  company: Company;
};

export type EditPersonInput = {
  id: Scalars['UUID'];
  person: PersonInput;
};

export type EditPersonOutput = EditPersonSuccess | NotFoundFailure | UniqueConstraintViolationFailure;

export type EditPersonSuccess = {
  __typename?: 'EditPersonSuccess';
  person: Person;
};

export type FailureOutput = {
  field: Scalars['String'];
  message: Scalars['String'];
};

export type File = {
  __typename?: 'File';
  encoding: Scalars['String'];
  filename: Scalars['String'];
  mimetype: Scalars['String'];
};

export type FileMetadataInvalidFile = FailureOutput & {
  __typename?: 'FileMetadataInvalidFile';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type FileMetadataResponse = FileMetadataInvalidFile | FileMetadataSuccess;

export type FileMetadataSuccess = {
  __typename?: 'FileMetadataSuccess';
  metadata: File;
};

export enum FilterOperator {
  And = 'AND',
  Or = 'OR'
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type InvalidCursorFailure = FailureOutput & {
  __typename?: 'InvalidCursorFailure';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type LoginUserFailure = {
  __typename?: 'LoginUserFailure';
  success: Scalars['Boolean'];
};

export type LoginUserInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type LoginUserResponse = LoginUserFailure | LoginUserSuccess;

export type LoginUserSuccess = {
  __typename?: 'LoginUserSuccess';
  token: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCompany: AddCompanyOutput;
  addEmployee: AddEmployeeOutput;
  /** Creates new person  */
  addPerson: AddPersonOutput;
  editCompany: EditCompanyOutput;
  /** Edit existing person */
  editPerson: EditPersonOutput;
  fileMetadata: FileMetadataResponse;
  login: LoginUserResponse;
  logout: Scalars['Boolean'];
  register: RegisterResponse;
  removeEmployee: RemoveEmployeeOutput;
};


export type MutationAddCompanyArgs = {
  input: AddCompanyInput;
};


export type MutationAddEmployeeArgs = {
  input: AddEmployeeInput;
};


export type MutationAddPersonArgs = {
  input: AddPersonInput;
};


export type MutationEditCompanyArgs = {
  input: EditCompanyInput;
};


export type MutationEditPersonArgs = {
  input: EditPersonInput;
};


export type MutationFileMetadataArgs = {
  file: Scalars['Upload'];
};


export type MutationLoginArgs = {
  input: LoginUserInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRemoveEmployeeArgs = {
  input: RemoveEmployeeInput;
};

export type NotFoundFailure = FailureOutput & {
  __typename?: 'NotFoundFailure';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type NumberFact = {
  __typename?: 'NumberFact';
  fact: Scalars['String'];
  number: Scalars['Int'];
};

export type NumberFactFailure = {
  __typename?: 'NumberFactFailure';
  success?: Maybe<Scalars['Boolean']>;
};

export type NumberFactInput = {
  number: Scalars['Int'];
};

export type NumberFactOutput = NumberFactFailure | NumberFactSuccess;

export type NumberFactSuccess = {
  __typename?: 'NumberFactSuccess';
  numberFact: NumberFact;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
};

export type PaginationInput = {
  cursor?: Maybe<Scalars['Cursor']>;
  limit?: Maybe<Scalars['Int']>;
};

export type Person = {
  birthday: Scalars['Date'];
  email: Scalars['EmailAddress'];
  firstName: Scalars['String'];
  gender: Gender;
  id: Scalars['UUID'];
  /** Requires authentication and ADMIN privileges */
  internalId: Scalars['ID'];
  lastName: Scalars['String'];
  nationality: Scalars['CountryCode'];
  /** Requires authentication and USER privileges */
  personalIdentityCode: Scalars['PersonalIdentityCode'];
  phone?: Maybe<Scalars['PhoneNumber']>;
  timestamp: Timestamp;
};

export type PersonFilterInput = {
  birthdayFilter?: Maybe<DateFilter>;
  filterOperations?: Maybe<Array<PersonFilterOperationInput>>;
  nameFilter?: Maybe<StringFilter>;
};

export type PersonFilterOperationInput = {
  filters?: Maybe<Array<PersonFilterInput>>;
  operator: FilterOperator;
};

export type PersonInput = {
  birthday: Scalars['Date'];
  email: Scalars['EmailAddress'];
  firstName: Scalars['String'];
  gender: Gender;
  id: Scalars['UUID'];
  /** Last name has to be minimum of 1 chracters and maximum of 50 */
  lastName: Scalars['String'];
  nationality: Scalars['CountryCode'];
  personalIdentityCode: Scalars['PersonalIdentityCode'];
  phone: Scalars['PhoneNumber'];
};

export enum PersonSortField {
  Birthday = 'birthday',
  CreatedAt = 'createdAt',
  FirstName = 'firstName',
  LastName = 'lastName'
}

export type PersonSortInput = {
  field: PersonSortField;
  order: SortOrder;
};

export type PersonsPaginationEdge = {
  __typename?: 'PersonsPaginationEdge';
  cursor: Scalars['Cursor'];
  node: Person;
};

export type PersonsPaginationOutput = InvalidCursorFailure | PersonsPaginationResponse;

export type PersonsPaginationResponse = {
  __typename?: 'PersonsPaginationResponse';
  edges: Array<PersonsPaginationEdge>;
  pageInfo: PageInfo;
};

export type Query = {
  __typename?: 'Query';
  authenticatedUser: AuthenticatedUserResponse;
  /** Returns cached person. requires authentication. cahed for 120 seconds */
  cachedPerson: Person;
  companies: Array<Company>;
  company: CompanyOutput;
  /** Returns newest persons as list  */
  newestPersons: Array<Person>;
  numberFact: NumberFactOutput;
  /** Returns person. requires authentication. */
  person: Person;
  /**
   * ### Paginated header result
   *
   * **input arguments**
   * 1. filter
   * 2. sort
   * 3. pagination - mandatory
   */
  persons: PersonsPaginationOutput;
};


export type QueryCachedPersonArgs = {
  input: PersonInput;
};


export type QueryCompaniesArgs = {
  filters?: Maybe<CompanyFilterOperationInput>;
};


export type QueryCompanyArgs = {
  input: CompanyQuery;
};


export type QueryNumberFactArgs = {
  input: NumberFactInput;
};


export type QueryPersonArgs = {
  input: PersonInput;
};


export type QueryPersonsArgs = {
  filters?: Maybe<PersonFilterOperationInput>;
  pagination: PaginationInput;
  sort?: Maybe<Array<PersonSortInput>>;
};

export type RegisterFailure = {
  __typename?: 'RegisterFailure';
  success: Scalars['Boolean'];
};

export type RegisterFailureAlreadyExists = {
  __typename?: 'RegisterFailureAlreadyExists';
  success: Scalars['Boolean'];
};

export type RegisterInput = {
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
  phoneNumber: Scalars['PhoneNumber'];
  username: Scalars['String'];
};

export type RegisterResponse = RegisterFailure | RegisterFailureAlreadyExists | RegisterSuccess;

export type RegisterSuccess = {
  __typename?: 'RegisterSuccess';
  success: Scalars['Boolean'];
};

export type RemoveEmployeeInput = {
  companyId: Scalars['UUID'];
  personId: Scalars['UUID'];
};

export type RemoveEmployeeOutput = RemoveEmployeeSuccess;

export type RemoveEmployeeSuccess = {
  __typename?: 'RemoveEmployeeSuccess';
  company: Company;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringFilter = {
  in?: Maybe<Array<Scalars['String']>>;
  like?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  personAdded: Person;
};

export type TimeFilter = {
  equal?: Maybe<Scalars['DateTime']>;
  greaterOrEqualThan?: Maybe<Scalars['DateTime']>;
  greaterThan?: Maybe<Scalars['DateTime']>;
  lessOrEqualThan?: Maybe<Scalars['DateTime']>;
  lessThan?: Maybe<Scalars['DateTime']>;
  notEqual?: Maybe<Scalars['DateTime']>;
};

export type Timestamp = {
  __typename?: 'Timestamp';
  createdAt: Scalars['DateTime'];
  modifiedAt?: Maybe<Scalars['DateTime']>;
};

/** Underage is under 16 years old Person */
export type Underage = Person & {
  __typename?: 'Underage';
  birthday: Scalars['Date'];
  email: Scalars['EmailAddress'];
  firstName: Scalars['String'];
  gender: Gender;
  id: Scalars['UUID'];
  /** Requires authentication and ADMIN privileges */
  internalId: Scalars['ID'];
  lastName: Scalars['String'];
  nationality: Scalars['CountryCode'];
  /** Requires authentication and USER privileges */
  personalIdentityCode: Scalars['PersonalIdentityCode'];
  phone?: Maybe<Scalars['PhoneNumber']>;
  timestamp: Timestamp;
};

/** Operation fails because some value is not unique */
export type UniqueConstraintViolationFailure = FailureOutput & {
  __typename?: 'UniqueConstraintViolationFailure';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['UUID'];
  username: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccessRight: AccessRight;
  AddCompanyInput: AddCompanyInput;
  AddCompanyOutput: ResolversTypes['AddCompanySuccess'];
  AddCompanySuccess: ResolverTypeWrapper<Omit<AddCompanySuccess, 'company'> & { company: ResolversTypes['Company'] }>;
  AddEmployeeInput: AddEmployeeInput;
  AddEmployeeOutput: ResolversTypes['AddEmployeeSuccess'];
  AddEmployeeSuccess: ResolverTypeWrapper<Omit<AddEmployeeSuccess, 'company'> & { company: ResolversTypes['Company'] }>;
  AddPersonInput: AddPersonInput;
  AddPersonOutput: ResolversTypes['AddPersonSuccess'] | ResolversTypes['UniqueConstraintViolationFailure'];
  AddPersonSuccess: ResolverTypeWrapper<Omit<AddPersonSuccess, 'person'> & { person: ResolversTypes['Person'] }>;
  Adult: ResolverTypeWrapper<AdultModel>;
  AuthenticatedUserFailure: ResolverTypeWrapper<AuthenticatedUserFailure>;
  AuthenticatedUserResponse: ResolversTypes['AuthenticatedUserFailure'] | ResolversTypes['AuthenticatedUserSuccess'];
  AuthenticatedUserSuccess: ResolverTypeWrapper<Omit<AuthenticatedUserSuccess, 'user'> & { user: ResolversTypes['User'] }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CacheControlScope: CacheControlScope;
  Company: ResolverTypeWrapper<CompanyModel>;
  CompanyFailureNotFound: ResolverTypeWrapper<CompanyFailureNotFound>;
  CompanyFilterInput: CompanyFilterInput;
  CompanyFilterOperationInput: CompanyFilterOperationInput;
  CompanyInput: CompanyInput;
  CompanyOutput: ResolversTypes['CompanyFailureNotFound'] | ResolversTypes['CompanySuccess'];
  CompanyQuery: CompanyQuery;
  CompanySuccess: ResolverTypeWrapper<Omit<CompanySuccess, 'company'> & { company: ResolversTypes['Company'] }>;
  CountryCode: ResolverTypeWrapper<Scalars['CountryCode']>;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateFilter: DateFilter;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  EditCompanyFailureNotFound: ResolverTypeWrapper<EditCompanyFailureNotFound>;
  EditCompanyInput: EditCompanyInput;
  EditCompanyOutput: ResolversTypes['EditCompanyFailureNotFound'] | ResolversTypes['EditCompanySuccess'];
  EditCompanySuccess: ResolverTypeWrapper<Omit<EditCompanySuccess, 'company'> & { company: ResolversTypes['Company'] }>;
  EditPersonInput: EditPersonInput;
  EditPersonOutput: ResolversTypes['EditPersonSuccess'] | ResolversTypes['NotFoundFailure'] | ResolversTypes['UniqueConstraintViolationFailure'];
  EditPersonSuccess: ResolverTypeWrapper<Omit<EditPersonSuccess, 'person'> & { person: ResolversTypes['Person'] }>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  FailureOutput: ResolversTypes['FileMetadataInvalidFile'] | ResolversTypes['InvalidCursorFailure'] | ResolversTypes['NotFoundFailure'] | ResolversTypes['UniqueConstraintViolationFailure'];
  File: ResolverTypeWrapper<File>;
  FileMetadataInvalidFile: ResolverTypeWrapper<FileMetadataInvalidFile>;
  FileMetadataResponse: ResolversTypes['FileMetadataInvalidFile'] | ResolversTypes['FileMetadataSuccess'];
  FileMetadataSuccess: ResolverTypeWrapper<FileMetadataSuccess>;
  FilterOperator: FilterOperator;
  Gender: Gender;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  InvalidCursorFailure: ResolverTypeWrapper<InvalidCursorFailure>;
  LoginUserFailure: ResolverTypeWrapper<LoginUserFailure>;
  LoginUserInput: LoginUserInput;
  LoginUserResponse: ResolversTypes['LoginUserFailure'] | ResolversTypes['LoginUserSuccess'];
  LoginUserSuccess: ResolverTypeWrapper<Omit<LoginUserSuccess, 'user'> & { user: ResolversTypes['User'] }>;
  Mutation: ResolverTypeWrapper<{}>;
  NotFoundFailure: ResolverTypeWrapper<NotFoundFailure>;
  NumberFact: ResolverTypeWrapper<NumberFact>;
  NumberFactFailure: ResolverTypeWrapper<NumberFactFailure>;
  NumberFactInput: NumberFactInput;
  NumberFactOutput: ResolversTypes['NumberFactFailure'] | ResolversTypes['NumberFactSuccess'];
  NumberFactSuccess: ResolverTypeWrapper<NumberFactSuccess>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginationInput: PaginationInput;
  Person: ResolverTypeWrapper<PersonModel>;
  PersonFilterInput: PersonFilterInput;
  PersonFilterOperationInput: PersonFilterOperationInput;
  PersonInput: PersonInput;
  PersonSortField: PersonSortField;
  PersonSortInput: PersonSortInput;
  PersonalIdentityCode: ResolverTypeWrapper<Scalars['PersonalIdentityCode']>;
  PersonsPaginationEdge: ResolverTypeWrapper<Omit<PersonsPaginationEdge, 'node'> & { node: ResolversTypes['Person'] }>;
  PersonsPaginationOutput: ResolversTypes['InvalidCursorFailure'] | ResolversTypes['PersonsPaginationResponse'];
  PersonsPaginationResponse: ResolverTypeWrapper<Omit<PersonsPaginationResponse, 'edges'> & { edges: Array<ResolversTypes['PersonsPaginationEdge']> }>;
  PhoneNumber: ResolverTypeWrapper<Scalars['PhoneNumber']>;
  Query: ResolverTypeWrapper<{}>;
  RegisterFailure: ResolverTypeWrapper<RegisterFailure>;
  RegisterFailureAlreadyExists: ResolverTypeWrapper<RegisterFailureAlreadyExists>;
  RegisterInput: RegisterInput;
  RegisterResponse: ResolversTypes['RegisterFailure'] | ResolversTypes['RegisterFailureAlreadyExists'] | ResolversTypes['RegisterSuccess'];
  RegisterSuccess: ResolverTypeWrapper<RegisterSuccess>;
  RemoveEmployeeInput: RemoveEmployeeInput;
  RemoveEmployeeOutput: ResolversTypes['RemoveEmployeeSuccess'];
  RemoveEmployeeSuccess: ResolverTypeWrapper<Omit<RemoveEmployeeSuccess, 'company'> & { company: ResolversTypes['Company'] }>;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']>;
  StringFilter: StringFilter;
  Subscription: ResolverTypeWrapper<{}>;
  TimeFilter: TimeFilter;
  Timestamp: ResolverTypeWrapper<Timestamp>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  Underage: ResolverTypeWrapper<Underage>;
  UniqueConstraintViolationFailure: ResolverTypeWrapper<UniqueConstraintViolationFailure>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<UserModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddCompanyInput: AddCompanyInput;
  AddCompanyOutput: ResolversParentTypes['AddCompanySuccess'];
  AddCompanySuccess: Omit<AddCompanySuccess, 'company'> & { company: ResolversParentTypes['Company'] };
  AddEmployeeInput: AddEmployeeInput;
  AddEmployeeOutput: ResolversParentTypes['AddEmployeeSuccess'];
  AddEmployeeSuccess: Omit<AddEmployeeSuccess, 'company'> & { company: ResolversParentTypes['Company'] };
  AddPersonInput: AddPersonInput;
  AddPersonOutput: ResolversParentTypes['AddPersonSuccess'] | ResolversParentTypes['UniqueConstraintViolationFailure'];
  AddPersonSuccess: Omit<AddPersonSuccess, 'person'> & { person: ResolversParentTypes['Person'] };
  Adult: AdultModel;
  AuthenticatedUserFailure: AuthenticatedUserFailure;
  AuthenticatedUserResponse: ResolversParentTypes['AuthenticatedUserFailure'] | ResolversParentTypes['AuthenticatedUserSuccess'];
  AuthenticatedUserSuccess: Omit<AuthenticatedUserSuccess, 'user'> & { user: ResolversParentTypes['User'] };
  Boolean: Scalars['Boolean'];
  Company: CompanyModel;
  CompanyFailureNotFound: CompanyFailureNotFound;
  CompanyFilterInput: CompanyFilterInput;
  CompanyFilterOperationInput: CompanyFilterOperationInput;
  CompanyInput: CompanyInput;
  CompanyOutput: ResolversParentTypes['CompanyFailureNotFound'] | ResolversParentTypes['CompanySuccess'];
  CompanyQuery: CompanyQuery;
  CompanySuccess: Omit<CompanySuccess, 'company'> & { company: ResolversParentTypes['Company'] };
  CountryCode: Scalars['CountryCode'];
  Cursor: Scalars['Cursor'];
  Date: Scalars['Date'];
  DateFilter: DateFilter;
  DateTime: Scalars['DateTime'];
  EditCompanyFailureNotFound: EditCompanyFailureNotFound;
  EditCompanyInput: EditCompanyInput;
  EditCompanyOutput: ResolversParentTypes['EditCompanyFailureNotFound'] | ResolversParentTypes['EditCompanySuccess'];
  EditCompanySuccess: Omit<EditCompanySuccess, 'company'> & { company: ResolversParentTypes['Company'] };
  EditPersonInput: EditPersonInput;
  EditPersonOutput: ResolversParentTypes['EditPersonSuccess'] | ResolversParentTypes['NotFoundFailure'] | ResolversParentTypes['UniqueConstraintViolationFailure'];
  EditPersonSuccess: Omit<EditPersonSuccess, 'person'> & { person: ResolversParentTypes['Person'] };
  EmailAddress: Scalars['EmailAddress'];
  FailureOutput: ResolversParentTypes['FileMetadataInvalidFile'] | ResolversParentTypes['InvalidCursorFailure'] | ResolversParentTypes['NotFoundFailure'] | ResolversParentTypes['UniqueConstraintViolationFailure'];
  File: File;
  FileMetadataInvalidFile: FileMetadataInvalidFile;
  FileMetadataResponse: ResolversParentTypes['FileMetadataInvalidFile'] | ResolversParentTypes['FileMetadataSuccess'];
  FileMetadataSuccess: FileMetadataSuccess;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  InvalidCursorFailure: InvalidCursorFailure;
  LoginUserFailure: LoginUserFailure;
  LoginUserInput: LoginUserInput;
  LoginUserResponse: ResolversParentTypes['LoginUserFailure'] | ResolversParentTypes['LoginUserSuccess'];
  LoginUserSuccess: Omit<LoginUserSuccess, 'user'> & { user: ResolversParentTypes['User'] };
  Mutation: {};
  NotFoundFailure: NotFoundFailure;
  NumberFact: NumberFact;
  NumberFactFailure: NumberFactFailure;
  NumberFactInput: NumberFactInput;
  NumberFactOutput: ResolversParentTypes['NumberFactFailure'] | ResolversParentTypes['NumberFactSuccess'];
  NumberFactSuccess: NumberFactSuccess;
  PageInfo: PageInfo;
  PaginationInput: PaginationInput;
  Person: PersonModel;
  PersonFilterInput: PersonFilterInput;
  PersonFilterOperationInput: PersonFilterOperationInput;
  PersonInput: PersonInput;
  PersonSortInput: PersonSortInput;
  PersonalIdentityCode: Scalars['PersonalIdentityCode'];
  PersonsPaginationEdge: Omit<PersonsPaginationEdge, 'node'> & { node: ResolversParentTypes['Person'] };
  PersonsPaginationOutput: ResolversParentTypes['InvalidCursorFailure'] | ResolversParentTypes['PersonsPaginationResponse'];
  PersonsPaginationResponse: Omit<PersonsPaginationResponse, 'edges'> & { edges: Array<ResolversParentTypes['PersonsPaginationEdge']> };
  PhoneNumber: Scalars['PhoneNumber'];
  Query: {};
  RegisterFailure: RegisterFailure;
  RegisterFailureAlreadyExists: RegisterFailureAlreadyExists;
  RegisterInput: RegisterInput;
  RegisterResponse: ResolversParentTypes['RegisterFailure'] | ResolversParentTypes['RegisterFailureAlreadyExists'] | ResolversParentTypes['RegisterSuccess'];
  RegisterSuccess: RegisterSuccess;
  RemoveEmployeeInput: RemoveEmployeeInput;
  RemoveEmployeeOutput: ResolversParentTypes['RemoveEmployeeSuccess'];
  RemoveEmployeeSuccess: Omit<RemoveEmployeeSuccess, 'company'> & { company: ResolversParentTypes['Company'] };
  String: Scalars['String'];
  StringFilter: StringFilter;
  Subscription: {};
  TimeFilter: TimeFilter;
  Timestamp: Timestamp;
  UUID: Scalars['UUID'];
  Underage: Underage;
  UniqueConstraintViolationFailure: UniqueConstraintViolationFailure;
  Upload: Scalars['Upload'];
  User: UserModel;
}>;

export type AuthDirectiveArgs = {
  requires?: Maybe<AccessRight>;
};

export type AuthDirectiveResolver<Result, Parent, ContextType = Context, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CacheControlDirectiveArgs = {
  inheritMaxAge?: Maybe<Scalars['Boolean']>;
  maxAge?: Maybe<Scalars['Int']>;
  scope?: Maybe<CacheControlScope>;
};

export type CacheControlDirectiveResolver<Result, Parent, ContextType = Context, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LengthDirectiveArgs = {
  max?: Maybe<Scalars['Int']>;
  min?: Maybe<Scalars['Int']>;
};

export type LengthDirectiveResolver<Result, Parent, ContextType = Context, Args = LengthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AddCompanyOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddCompanyOutput'] = ResolversParentTypes['AddCompanyOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AddCompanySuccess', ParentType, ContextType>;
}>;

export type AddCompanySuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddCompanySuccess'] = ResolversParentTypes['AddCompanySuccess']> = ResolversObject<{
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddEmployeeOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddEmployeeOutput'] = ResolversParentTypes['AddEmployeeOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AddEmployeeSuccess', ParentType, ContextType>;
}>;

export type AddEmployeeSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddEmployeeSuccess'] = ResolversParentTypes['AddEmployeeSuccess']> = ResolversObject<{
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddPersonOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddPersonOutput'] = ResolversParentTypes['AddPersonOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AddPersonSuccess' | 'UniqueConstraintViolationFailure', ParentType, ContextType>;
}>;

export type AddPersonSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddPersonSuccess'] = ResolversParentTypes['AddPersonSuccess']> = ResolversObject<{
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Adult'] = ResolversParentTypes['Adult']> = ResolversObject<{
  birthday?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>;
  employers?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['Gender'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  internalId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nationality?: Resolver<ResolversTypes['CountryCode'], ParentType, ContextType>;
  personalIdentityCode?: Resolver<ResolversTypes['PersonalIdentityCode'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['PhoneNumber']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticatedUserFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticatedUserFailure'] = ResolversParentTypes['AuthenticatedUserFailure']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticatedUserResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticatedUserResponse'] = ResolversParentTypes['AuthenticatedUserResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticatedUserFailure' | 'AuthenticatedUserSuccess', ParentType, ContextType>;
}>;

export type AuthenticatedUserSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticatedUserSuccess'] = ResolversParentTypes['AuthenticatedUserSuccess']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompanyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = ResolversObject<{
  employees?: Resolver<Array<ResolversTypes['Adult']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompanyFailureNotFoundResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CompanyFailureNotFound'] = ResolversParentTypes['CompanyFailureNotFound']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompanyOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CompanyOutput'] = ResolversParentTypes['CompanyOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CompanyFailureNotFound' | 'CompanySuccess', ParentType, ContextType>;
}>;

export type CompanySuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CompanySuccess'] = ResolversParentTypes['CompanySuccess']> = ResolversObject<{
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface CountryCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CountryCode'], any> {
  name: 'CountryCode';
}

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EditCompanyFailureNotFoundResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditCompanyFailureNotFound'] = ResolversParentTypes['EditCompanyFailureNotFound']> = ResolversObject<{
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditCompanyOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditCompanyOutput'] = ResolversParentTypes['EditCompanyOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EditCompanyFailureNotFound' | 'EditCompanySuccess', ParentType, ContextType>;
}>;

export type EditCompanySuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditCompanySuccess'] = ResolversParentTypes['EditCompanySuccess']> = ResolversObject<{
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditPersonOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditPersonOutput'] = ResolversParentTypes['EditPersonOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EditPersonSuccess' | 'NotFoundFailure' | 'UniqueConstraintViolationFailure', ParentType, ContextType>;
}>;

export type EditPersonSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditPersonSuccess'] = ResolversParentTypes['EditPersonSuccess']> = ResolversObject<{
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export type FailureOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FailureOutput'] = ResolversParentTypes['FailureOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'FileMetadataInvalidFile' | 'InvalidCursorFailure' | 'NotFoundFailure' | 'UniqueConstraintViolationFailure', ParentType, ContextType>;
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type FileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = ResolversObject<{
  encoding?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileMetadataInvalidFileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FileMetadataInvalidFile'] = ResolversParentTypes['FileMetadataInvalidFile']> = ResolversObject<{
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileMetadataResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FileMetadataResponse'] = ResolversParentTypes['FileMetadataResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'FileMetadataInvalidFile' | 'FileMetadataSuccess', ParentType, ContextType>;
}>;

export type FileMetadataSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FileMetadataSuccess'] = ResolversParentTypes['FileMetadataSuccess']> = ResolversObject<{
  metadata?: Resolver<ResolversTypes['File'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InvalidCursorFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['InvalidCursorFailure'] = ResolversParentTypes['InvalidCursorFailure']> = ResolversObject<{
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginUserFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginUserFailure'] = ResolversParentTypes['LoginUserFailure']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginUserResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginUserResponse'] = ResolversParentTypes['LoginUserResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LoginUserFailure' | 'LoginUserSuccess', ParentType, ContextType>;
}>;

export type LoginUserSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginUserSuccess'] = ResolversParentTypes['LoginUserSuccess']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addCompany?: Resolver<ResolversTypes['AddCompanyOutput'], ParentType, ContextType, RequireFields<MutationAddCompanyArgs, 'input'>>;
  addEmployee?: Resolver<ResolversTypes['AddEmployeeOutput'], ParentType, ContextType, RequireFields<MutationAddEmployeeArgs, 'input'>>;
  addPerson?: Resolver<ResolversTypes['AddPersonOutput'], ParentType, ContextType, RequireFields<MutationAddPersonArgs, 'input'>>;
  editCompany?: Resolver<ResolversTypes['EditCompanyOutput'], ParentType, ContextType, RequireFields<MutationEditCompanyArgs, 'input'>>;
  editPerson?: Resolver<ResolversTypes['EditPersonOutput'], ParentType, ContextType, RequireFields<MutationEditPersonArgs, 'input'>>;
  fileMetadata?: Resolver<ResolversTypes['FileMetadataResponse'], ParentType, ContextType, RequireFields<MutationFileMetadataArgs, 'file'>>;
  login?: Resolver<ResolversTypes['LoginUserResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['RegisterResponse'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  removeEmployee?: Resolver<ResolversTypes['RemoveEmployeeOutput'], ParentType, ContextType, RequireFields<MutationRemoveEmployeeArgs, 'input'>>;
}>;

export type NotFoundFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotFoundFailure'] = ResolversParentTypes['NotFoundFailure']> = ResolversObject<{
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NumberFactResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NumberFact'] = ResolversParentTypes['NumberFact']> = ResolversObject<{
  fact?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NumberFactFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NumberFactFailure'] = ResolversParentTypes['NumberFactFailure']> = ResolversObject<{
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NumberFactOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NumberFactOutput'] = ResolversParentTypes['NumberFactOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NumberFactFailure' | 'NumberFactSuccess', ParentType, ContextType>;
}>;

export type NumberFactSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NumberFactSuccess'] = ResolversParentTypes['NumberFactSuccess']> = ResolversObject<{
  numberFact?: Resolver<ResolversTypes['NumberFact'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Adult' | 'Underage', ParentType, ContextType>;
  birthday?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['Gender'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  internalId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nationality?: Resolver<ResolversTypes['CountryCode'], ParentType, ContextType>;
  personalIdentityCode?: Resolver<ResolversTypes['PersonalIdentityCode'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['PhoneNumber']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
}>;

export interface PersonalIdentityCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PersonalIdentityCode'], any> {
  name: 'PersonalIdentityCode';
}

export type PersonsPaginationEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PersonsPaginationEdge'] = ResolversParentTypes['PersonsPaginationEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonsPaginationOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PersonsPaginationOutput'] = ResolversParentTypes['PersonsPaginationOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'InvalidCursorFailure' | 'PersonsPaginationResponse', ParentType, ContextType>;
}>;

export type PersonsPaginationResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PersonsPaginationResponse'] = ResolversParentTypes['PersonsPaginationResponse']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PersonsPaginationEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface PhoneNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PhoneNumber'], any> {
  name: 'PhoneNumber';
}

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  authenticatedUser?: Resolver<ResolversTypes['AuthenticatedUserResponse'], ParentType, ContextType>;
  cachedPerson?: Resolver<ResolversTypes['Person'], ParentType, ContextType, RequireFields<QueryCachedPersonArgs, 'input'>>;
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType, RequireFields<QueryCompaniesArgs, never>>;
  company?: Resolver<ResolversTypes['CompanyOutput'], ParentType, ContextType, RequireFields<QueryCompanyArgs, 'input'>>;
  newestPersons?: Resolver<Array<ResolversTypes['Person']>, ParentType, ContextType>;
  numberFact?: Resolver<ResolversTypes['NumberFactOutput'], ParentType, ContextType, RequireFields<QueryNumberFactArgs, 'input'>>;
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType, RequireFields<QueryPersonArgs, 'input'>>;
  persons?: Resolver<ResolversTypes['PersonsPaginationOutput'], ParentType, ContextType, RequireFields<QueryPersonsArgs, 'pagination'>>;
}>;

export type RegisterFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterFailure'] = ResolversParentTypes['RegisterFailure']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterFailureAlreadyExistsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterFailureAlreadyExists'] = ResolversParentTypes['RegisterFailureAlreadyExists']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterResponse'] = ResolversParentTypes['RegisterResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'RegisterFailure' | 'RegisterFailureAlreadyExists' | 'RegisterSuccess', ParentType, ContextType>;
}>;

export type RegisterSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterSuccess'] = ResolversParentTypes['RegisterSuccess']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RemoveEmployeeOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RemoveEmployeeOutput'] = ResolversParentTypes['RemoveEmployeeOutput']> = ResolversObject<{
  __resolveType: TypeResolveFn<'RemoveEmployeeSuccess', ParentType, ContextType>;
}>;

export type RemoveEmployeeSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RemoveEmployeeSuccess'] = ResolversParentTypes['RemoveEmployeeSuccess']> = ResolversObject<{
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  personAdded?: SubscriptionResolver<ResolversTypes['Person'], "personAdded", ParentType, ContextType>;
}>;

export type TimestampResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Timestamp'] = ResolversParentTypes['Timestamp']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  modifiedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type UnderageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Underage'] = ResolversParentTypes['Underage']> = ResolversObject<{
  birthday?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['Gender'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  internalId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nationality?: Resolver<ResolversTypes['CountryCode'], ParentType, ContextType>;
  personalIdentityCode?: Resolver<ResolversTypes['PersonalIdentityCode'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['PhoneNumber']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UniqueConstraintViolationFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UniqueConstraintViolationFailure'] = ResolversParentTypes['UniqueConstraintViolationFailure']> = ResolversObject<{
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AddCompanyOutput?: AddCompanyOutputResolvers<ContextType>;
  AddCompanySuccess?: AddCompanySuccessResolvers<ContextType>;
  AddEmployeeOutput?: AddEmployeeOutputResolvers<ContextType>;
  AddEmployeeSuccess?: AddEmployeeSuccessResolvers<ContextType>;
  AddPersonOutput?: AddPersonOutputResolvers<ContextType>;
  AddPersonSuccess?: AddPersonSuccessResolvers<ContextType>;
  Adult?: AdultResolvers<ContextType>;
  AuthenticatedUserFailure?: AuthenticatedUserFailureResolvers<ContextType>;
  AuthenticatedUserResponse?: AuthenticatedUserResponseResolvers<ContextType>;
  AuthenticatedUserSuccess?: AuthenticatedUserSuccessResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  CompanyFailureNotFound?: CompanyFailureNotFoundResolvers<ContextType>;
  CompanyOutput?: CompanyOutputResolvers<ContextType>;
  CompanySuccess?: CompanySuccessResolvers<ContextType>;
  CountryCode?: GraphQLScalarType;
  Cursor?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  EditCompanyFailureNotFound?: EditCompanyFailureNotFoundResolvers<ContextType>;
  EditCompanyOutput?: EditCompanyOutputResolvers<ContextType>;
  EditCompanySuccess?: EditCompanySuccessResolvers<ContextType>;
  EditPersonOutput?: EditPersonOutputResolvers<ContextType>;
  EditPersonSuccess?: EditPersonSuccessResolvers<ContextType>;
  EmailAddress?: GraphQLScalarType;
  FailureOutput?: FailureOutputResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  FileMetadataInvalidFile?: FileMetadataInvalidFileResolvers<ContextType>;
  FileMetadataResponse?: FileMetadataResponseResolvers<ContextType>;
  FileMetadataSuccess?: FileMetadataSuccessResolvers<ContextType>;
  InvalidCursorFailure?: InvalidCursorFailureResolvers<ContextType>;
  LoginUserFailure?: LoginUserFailureResolvers<ContextType>;
  LoginUserResponse?: LoginUserResponseResolvers<ContextType>;
  LoginUserSuccess?: LoginUserSuccessResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotFoundFailure?: NotFoundFailureResolvers<ContextType>;
  NumberFact?: NumberFactResolvers<ContextType>;
  NumberFactFailure?: NumberFactFailureResolvers<ContextType>;
  NumberFactOutput?: NumberFactOutputResolvers<ContextType>;
  NumberFactSuccess?: NumberFactSuccessResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  PersonalIdentityCode?: GraphQLScalarType;
  PersonsPaginationEdge?: PersonsPaginationEdgeResolvers<ContextType>;
  PersonsPaginationOutput?: PersonsPaginationOutputResolvers<ContextType>;
  PersonsPaginationResponse?: PersonsPaginationResponseResolvers<ContextType>;
  PhoneNumber?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RegisterFailure?: RegisterFailureResolvers<ContextType>;
  RegisterFailureAlreadyExists?: RegisterFailureAlreadyExistsResolvers<ContextType>;
  RegisterResponse?: RegisterResponseResolvers<ContextType>;
  RegisterSuccess?: RegisterSuccessResolvers<ContextType>;
  RemoveEmployeeOutput?: RemoveEmployeeOutputResolvers<ContextType>;
  RemoveEmployeeSuccess?: RemoveEmployeeSuccessResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Timestamp?: TimestampResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  Underage?: UnderageResolvers<ContextType>;
  UniqueConstraintViolationFailure?: UniqueConstraintViolationFailureResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
  length?: LengthDirectiveResolver<any, any, ContextType>;
}>;
