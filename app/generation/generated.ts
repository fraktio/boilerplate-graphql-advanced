/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable max-lines */
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { PhoneNumber } from "libphonenumber-js";
import { DateTime } from "luxon";

import { Context } from "../graphql/context";

import {
  UUID,
  CompanyModel,
  PersonModel,
  AdultModel,
  UserModel,
} from "./mappers";
import { EmailAddress } from "./scalars";

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  UUID: UUID;
  Date: DateTime;
  DateTime: DateTime;
  EmailAddress: EmailAddress;
  PhoneNumber: PhoneNumber;
};

export type AuthenticatedUserSuccess = {
  __typename?: "AuthenticatedUserSuccess";
  user: User;
};

export type AuthenticatedUserFailure = {
  __typename?: "AuthenticatedUserFailure";
  success: Scalars["Boolean"];
};

export type AuthenticatedUserResponse =
  | AuthenticatedUserSuccess
  | AuthenticatedUserFailure;

export type Query = {
  __typename?: "Query";
  authenticatedUser: AuthenticatedUserResponse;
  companies: Array<Company>;
  company: Company;
  numberFact: NumberFactOutput;
  person: Person;
  persons: Array<Maybe<Person>>;
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
  filter?: Maybe<PersonFilter>;
};

export type LoginUserSuccess = {
  __typename?: "LoginUserSuccess";
  user: User;
};

export type LoginUserFailure = {
  __typename?: "LoginUserFailure";
  success: Scalars["Boolean"];
};

export type LoginUserResponse = LoginUserSuccess | LoginUserFailure;

export type LoginUserInput = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  addCompany: AddCompanyOutput;
  addEmployee: AddEmployeeOutput;
  addPerson: AddPersonOutput;
  editCompany: EditCompanyOutput;
  editPerson: EditPersonOutput;
  login: LoginUserResponse;
  logout: Scalars["Boolean"];
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

export type MutationLoginArgs = {
  input: LoginUserInput;
};

export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type MutationRemoveEmployeeArgs = {
  input: RemoveEmployeeInput;
};

export type Company = {
  __typename?: "Company";
  UUID: Scalars["UUID"];
  name: Scalars["String"];
  timestamp: Timestamp;
  employees: Array<Adult>;
};

export type CompanyQuery = {
  UUID: Scalars["UUID"];
};

export type AddCompanyInput = {
  company: CompanyInput;
};

export type EditCompanyInput = {
  UUID: Scalars["UUID"];
  company: CompanyInput;
};

export type CompanyInput = {
  name: Scalars["String"];
};

export type AddCompanyOutput =
  | AddCompanySuccess
  | UniqueConstraintViolationFailure;

export type AddCompanySuccess = {
  __typename?: "AddCompanySuccess";
  company: Company;
};

export type EditCompanyOutput = EditCompanySuccess;

export type EditCompanySuccess = {
  __typename?: "EditCompanySuccess";
  company: Company;
};

export type AddEmployeeInput = {
  companyUUID: Scalars["UUID"];
  personUUID: Scalars["UUID"];
};

export type RemoveEmployeeInput = {
  companyUUID: Scalars["UUID"];
  personUUID: Scalars["UUID"];
};

export type AddEmployeeOutput = AddEmployeeSuccess;

export type AddEmployeeSuccess = {
  __typename?: "AddEmployeeSuccess";
  company: Company;
};

export type RemoveEmployeeOutput = RemoveEmployeeSuccess;

export type RemoveEmployeeSuccess = {
  __typename?: "RemoveEmployeeSuccess";
  company: Company;
};

export type FailureOutput = {
  message: Scalars["String"];
  field: Scalars["String"];
};

/** Operation fails because some value is not unique */
export type UniqueConstraintViolationFailure = FailureOutput & {
  __typename?: "UniqueConstraintViolationFailure";
  message: Scalars["String"];
  field: Scalars["String"];
};

export type TimeFilter = {
  equal?: Maybe<Scalars["DateTime"]>;
  notEqual?: Maybe<Scalars["DateTime"]>;
  lessThan?: Maybe<Scalars["DateTime"]>;
  lessOrEqualThan?: Maybe<Scalars["DateTime"]>;
  greaterThan?: Maybe<Scalars["DateTime"]>;
  greaterOrEqualThan?: Maybe<Scalars["DateTime"]>;
};

export type DateFilter = {
  equal?: Maybe<Scalars["Date"]>;
  notEqual?: Maybe<Scalars["Date"]>;
  lessThan?: Maybe<Scalars["Date"]>;
  lessOrEqualThan?: Maybe<Scalars["Date"]>;
  greaterThan?: Maybe<Scalars["Date"]>;
  greaterOrEqualThan?: Maybe<Scalars["Date"]>;
};

export enum AccessRight {
  User = "USER",
  Admin = "ADMIN",
}

export type Timestamp = {
  __typename?: "Timestamp";
  createdAt: Scalars["DateTime"];
  modifiedAt?: Maybe<Scalars["DateTime"]>;
};

export type NumberFact = {
  __typename?: "NumberFact";
  fact: Scalars["String"];
  number: Scalars["Int"];
};

export type NumberFactInput = {
  number: Scalars["Int"];
};

export type NumberFactSuccess = {
  __typename?: "NumberFactSuccess";
  numberFact: NumberFact;
};

export type NumberFactFailure = {
  __typename?: "NumberFactFailure";
  success?: Maybe<Scalars["Boolean"]>;
};

export type NumberFactOutput = NumberFactSuccess | NumberFactFailure;

export type Person = {
  /** Requires authentication and ADMIN privileges */
  UUID: Scalars["UUID"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  phone?: Maybe<Scalars["PhoneNumber"]>;
  email: Scalars["EmailAddress"];
  birthday: Scalars["Date"];
  timestamp: Timestamp;
};

/** Adult is over 16 years old Person */
export type Adult = Person & {
  __typename?: "Adult";
  /** Requires authentication and ADMIN privileges */
  UUID: Scalars["UUID"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  phone?: Maybe<Scalars["PhoneNumber"]>;
  email: Scalars["EmailAddress"];
  birthday: Scalars["Date"];
  timestamp: Timestamp;
  employers: Array<Company>;
};

/** Underage is under 16 years old Person */
export type Underage = Person & {
  __typename?: "Underage";
  /** Requires authentication and ADMIN privileges */
  UUID: Scalars["UUID"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  phone?: Maybe<Scalars["PhoneNumber"]>;
  email: Scalars["EmailAddress"];
  birthday: Scalars["Date"];
  timestamp: Timestamp;
};

export type PersonInput = {
  UUID: Scalars["UUID"];
};

export type Subscription = {
  __typename?: "Subscription";
  personAdded: Person;
};

export type AddPersonPersonInput = {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  phone?: Maybe<Scalars["PhoneNumber"]>;
  email: Scalars["EmailAddress"];
  birthday: Scalars["Date"];
};

export type AddPersonInput = {
  person: AddPersonPersonInput;
};

export type AddPersonOutput =
  | AddPersonSuccess
  | UniqueConstraintViolationFailure;

export type AddPersonSuccess = {
  __typename?: "AddPersonSuccess";
  person: Person;
};

export type EditPersonInput = {
  UUID: Scalars["UUID"];
  person: AddPersonPersonInput;
};

export type EditPersonOutput = EditPersonSuccess;

export type EditPersonSuccess = {
  __typename?: "EditPersonSuccess";
  person: Person;
};

export type PersonFilter = {
  birthdayFilter?: Maybe<DateFilter>;
};

export type RegisterSuccess = {
  __typename?: "RegisterSuccess";
  success: Scalars["Boolean"];
};

export type RegisterFailure = {
  __typename?: "RegisterFailure";
  success: Scalars["Boolean"];
};

export type RegisterFailureAlreadyExists = {
  __typename?: "RegisterFailureAlreadyExists";
  success: Scalars["Boolean"];
};

export type RegisterResponse =
  | RegisterSuccess
  | RegisterFailure
  | RegisterFailureAlreadyExists;

export type RegisterInput = {
  username: Scalars["String"];
  password: Scalars["String"];
  email: Scalars["EmailAddress"];
  phoneNumber: Scalars["PhoneNumber"];
};

export type User = {
  __typename?: "User";
  UUID: Scalars["UUID"];
  username: Scalars["String"];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthenticatedUserSuccess: ResolverTypeWrapper<
    Omit<AuthenticatedUserSuccess, "user"> & { user: ResolversTypes["User"] }
  >;
  AuthenticatedUserFailure: ResolverTypeWrapper<AuthenticatedUserFailure>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  AuthenticatedUserResponse:
    | ResolversTypes["AuthenticatedUserSuccess"]
    | ResolversTypes["AuthenticatedUserFailure"];
  Query: ResolverTypeWrapper<{}>;
  LoginUserSuccess: ResolverTypeWrapper<
    Omit<LoginUserSuccess, "user"> & { user: ResolversTypes["User"] }
  >;
  LoginUserFailure: ResolverTypeWrapper<LoginUserFailure>;
  LoginUserResponse:
    | ResolversTypes["LoginUserSuccess"]
    | ResolversTypes["LoginUserFailure"];
  LoginUserInput: LoginUserInput;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Company: ResolverTypeWrapper<CompanyModel>;
  CompanyQuery: CompanyQuery;
  AddCompanyInput: AddCompanyInput;
  EditCompanyInput: EditCompanyInput;
  CompanyInput: CompanyInput;
  AddCompanyOutput:
    | ResolversTypes["AddCompanySuccess"]
    | ResolversTypes["UniqueConstraintViolationFailure"];
  AddCompanySuccess: ResolverTypeWrapper<
    Omit<AddCompanySuccess, "company"> & { company: ResolversTypes["Company"] }
  >;
  EditCompanyOutput: ResolversTypes["EditCompanySuccess"];
  EditCompanySuccess: ResolverTypeWrapper<
    Omit<EditCompanySuccess, "company"> & { company: ResolversTypes["Company"] }
  >;
  AddEmployeeInput: AddEmployeeInput;
  RemoveEmployeeInput: RemoveEmployeeInput;
  AddEmployeeOutput: ResolversTypes["AddEmployeeSuccess"];
  AddEmployeeSuccess: ResolverTypeWrapper<
    Omit<AddEmployeeSuccess, "company"> & { company: ResolversTypes["Company"] }
  >;
  RemoveEmployeeOutput: ResolversTypes["RemoveEmployeeSuccess"];
  RemoveEmployeeSuccess: ResolverTypeWrapper<
    Omit<RemoveEmployeeSuccess, "company"> & {
      company: ResolversTypes["Company"];
    }
  >;
  FailureOutput: ResolversTypes["UniqueConstraintViolationFailure"];
  UniqueConstraintViolationFailure: ResolverTypeWrapper<UniqueConstraintViolationFailure>;
  TimeFilter: TimeFilter;
  DateFilter: DateFilter;
  UUID: ResolverTypeWrapper<Scalars["UUID"]>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]>;
  EmailAddress: ResolverTypeWrapper<Scalars["EmailAddress"]>;
  PhoneNumber: ResolverTypeWrapper<Scalars["PhoneNumber"]>;
  AccessRight: AccessRight;
  Timestamp: ResolverTypeWrapper<Timestamp>;
  NumberFact: ResolverTypeWrapper<NumberFact>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  NumberFactInput: NumberFactInput;
  NumberFactSuccess: ResolverTypeWrapper<NumberFactSuccess>;
  NumberFactFailure: ResolverTypeWrapper<NumberFactFailure>;
  NumberFactOutput:
    | ResolversTypes["NumberFactSuccess"]
    | ResolversTypes["NumberFactFailure"];
  Person: ResolverTypeWrapper<PersonModel>;
  Adult: ResolverTypeWrapper<AdultModel>;
  Underage: ResolverTypeWrapper<Underage>;
  PersonInput: PersonInput;
  Subscription: ResolverTypeWrapper<{}>;
  AddPersonPersonInput: AddPersonPersonInput;
  AddPersonInput: AddPersonInput;
  AddPersonOutput:
    | ResolversTypes["AddPersonSuccess"]
    | ResolversTypes["UniqueConstraintViolationFailure"];
  AddPersonSuccess: ResolverTypeWrapper<
    Omit<AddPersonSuccess, "person"> & { person: ResolversTypes["Person"] }
  >;
  EditPersonInput: EditPersonInput;
  EditPersonOutput: ResolversTypes["EditPersonSuccess"];
  EditPersonSuccess: ResolverTypeWrapper<
    Omit<EditPersonSuccess, "person"> & { person: ResolversTypes["Person"] }
  >;
  PersonFilter: PersonFilter;
  RegisterSuccess: ResolverTypeWrapper<RegisterSuccess>;
  RegisterFailure: ResolverTypeWrapper<RegisterFailure>;
  RegisterFailureAlreadyExists: ResolverTypeWrapper<RegisterFailureAlreadyExists>;
  RegisterResponse:
    | ResolversTypes["RegisterSuccess"]
    | ResolversTypes["RegisterFailure"]
    | ResolversTypes["RegisterFailureAlreadyExists"];
  RegisterInput: RegisterInput;
  User: ResolverTypeWrapper<UserModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthenticatedUserSuccess: Omit<AuthenticatedUserSuccess, "user"> & {
    user: ResolversParentTypes["User"];
  };
  AuthenticatedUserFailure: AuthenticatedUserFailure;
  Boolean: Scalars["Boolean"];
  AuthenticatedUserResponse:
    | ResolversParentTypes["AuthenticatedUserSuccess"]
    | ResolversParentTypes["AuthenticatedUserFailure"];
  Query: {};
  LoginUserSuccess: Omit<LoginUserSuccess, "user"> & {
    user: ResolversParentTypes["User"];
  };
  LoginUserFailure: LoginUserFailure;
  LoginUserResponse:
    | ResolversParentTypes["LoginUserSuccess"]
    | ResolversParentTypes["LoginUserFailure"];
  LoginUserInput: LoginUserInput;
  String: Scalars["String"];
  Mutation: {};
  Company: CompanyModel;
  CompanyQuery: CompanyQuery;
  AddCompanyInput: AddCompanyInput;
  EditCompanyInput: EditCompanyInput;
  CompanyInput: CompanyInput;
  AddCompanyOutput:
    | ResolversParentTypes["AddCompanySuccess"]
    | ResolversParentTypes["UniqueConstraintViolationFailure"];
  AddCompanySuccess: Omit<AddCompanySuccess, "company"> & {
    company: ResolversParentTypes["Company"];
  };
  EditCompanyOutput: ResolversParentTypes["EditCompanySuccess"];
  EditCompanySuccess: Omit<EditCompanySuccess, "company"> & {
    company: ResolversParentTypes["Company"];
  };
  AddEmployeeInput: AddEmployeeInput;
  RemoveEmployeeInput: RemoveEmployeeInput;
  AddEmployeeOutput: ResolversParentTypes["AddEmployeeSuccess"];
  AddEmployeeSuccess: Omit<AddEmployeeSuccess, "company"> & {
    company: ResolversParentTypes["Company"];
  };
  RemoveEmployeeOutput: ResolversParentTypes["RemoveEmployeeSuccess"];
  RemoveEmployeeSuccess: Omit<RemoveEmployeeSuccess, "company"> & {
    company: ResolversParentTypes["Company"];
  };
  FailureOutput: ResolversParentTypes["UniqueConstraintViolationFailure"];
  UniqueConstraintViolationFailure: UniqueConstraintViolationFailure;
  TimeFilter: TimeFilter;
  DateFilter: DateFilter;
  UUID: Scalars["UUID"];
  Date: Scalars["Date"];
  DateTime: Scalars["DateTime"];
  EmailAddress: Scalars["EmailAddress"];
  PhoneNumber: Scalars["PhoneNumber"];
  Timestamp: Timestamp;
  NumberFact: NumberFact;
  Int: Scalars["Int"];
  NumberFactInput: NumberFactInput;
  NumberFactSuccess: NumberFactSuccess;
  NumberFactFailure: NumberFactFailure;
  NumberFactOutput:
    | ResolversParentTypes["NumberFactSuccess"]
    | ResolversParentTypes["NumberFactFailure"];
  Person: PersonModel;
  Adult: AdultModel;
  Underage: Underage;
  PersonInput: PersonInput;
  Subscription: {};
  AddPersonPersonInput: AddPersonPersonInput;
  AddPersonInput: AddPersonInput;
  AddPersonOutput:
    | ResolversParentTypes["AddPersonSuccess"]
    | ResolversParentTypes["UniqueConstraintViolationFailure"];
  AddPersonSuccess: Omit<AddPersonSuccess, "person"> & {
    person: ResolversParentTypes["Person"];
  };
  EditPersonInput: EditPersonInput;
  EditPersonOutput: ResolversParentTypes["EditPersonSuccess"];
  EditPersonSuccess: Omit<EditPersonSuccess, "person"> & {
    person: ResolversParentTypes["Person"];
  };
  PersonFilter: PersonFilter;
  RegisterSuccess: RegisterSuccess;
  RegisterFailure: RegisterFailure;
  RegisterFailureAlreadyExists: RegisterFailureAlreadyExists;
  RegisterResponse:
    | ResolversParentTypes["RegisterSuccess"]
    | ResolversParentTypes["RegisterFailure"]
    | ResolversParentTypes["RegisterFailureAlreadyExists"];
  RegisterInput: RegisterInput;
  User: UserModel;
}>;

export type AuthenticatedDirectiveArgs = { requires?: Maybe<AccessRight> };

export type AuthenticatedDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = AuthenticatedDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthenticatedUserSuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AuthenticatedUserSuccess"] = ResolversParentTypes["AuthenticatedUserSuccess"]
> = ResolversObject<{
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticatedUserFailureResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AuthenticatedUserFailure"] = ResolversParentTypes["AuthenticatedUserFailure"]
> = ResolversObject<{
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticatedUserResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AuthenticatedUserResponse"] = ResolversParentTypes["AuthenticatedUserResponse"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "AuthenticatedUserSuccess" | "AuthenticatedUserFailure",
    ParentType,
    ContextType
  >;
}>;

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  authenticatedUser?: Resolver<
    ResolversTypes["AuthenticatedUserResponse"],
    ParentType,
    ContextType
  >;
  companies?: Resolver<
    Array<ResolversTypes["Company"]>,
    ParentType,
    ContextType
  >;
  company?: Resolver<
    ResolversTypes["Company"],
    ParentType,
    ContextType,
    RequireFields<QueryCompanyArgs, "input">
  >;
  numberFact?: Resolver<
    ResolversTypes["NumberFactOutput"],
    ParentType,
    ContextType,
    RequireFields<QueryNumberFactArgs, "input">
  >;
  person?: Resolver<
    ResolversTypes["Person"],
    ParentType,
    ContextType,
    RequireFields<QueryPersonArgs, "input">
  >;
  persons?: Resolver<
    Array<Maybe<ResolversTypes["Person"]>>,
    ParentType,
    ContextType,
    RequireFields<QueryPersonsArgs, never>
  >;
}>;

export type LoginUserSuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["LoginUserSuccess"] = ResolversParentTypes["LoginUserSuccess"]
> = ResolversObject<{
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginUserFailureResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["LoginUserFailure"] = ResolversParentTypes["LoginUserFailure"]
> = ResolversObject<{
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginUserResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["LoginUserResponse"] = ResolversParentTypes["LoginUserResponse"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "LoginUserSuccess" | "LoginUserFailure",
    ParentType,
    ContextType
  >;
}>;

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  addCompany?: Resolver<
    ResolversTypes["AddCompanyOutput"],
    ParentType,
    ContextType,
    RequireFields<MutationAddCompanyArgs, "input">
  >;
  addEmployee?: Resolver<
    ResolversTypes["AddEmployeeOutput"],
    ParentType,
    ContextType,
    RequireFields<MutationAddEmployeeArgs, "input">
  >;
  addPerson?: Resolver<
    ResolversTypes["AddPersonOutput"],
    ParentType,
    ContextType,
    RequireFields<MutationAddPersonArgs, "input">
  >;
  editCompany?: Resolver<
    ResolversTypes["EditCompanyOutput"],
    ParentType,
    ContextType,
    RequireFields<MutationEditCompanyArgs, "input">
  >;
  editPerson?: Resolver<
    ResolversTypes["EditPersonOutput"],
    ParentType,
    ContextType,
    RequireFields<MutationEditPersonArgs, "input">
  >;
  login?: Resolver<
    ResolversTypes["LoginUserResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "input">
  >;
  logout?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  register?: Resolver<
    ResolversTypes["RegisterResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, "input">
  >;
  removeEmployee?: Resolver<
    ResolversTypes["RemoveEmployeeOutput"],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveEmployeeArgs, "input">
  >;
}>;

export type CompanyResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Company"] = ResolversParentTypes["Company"]
> = ResolversObject<{
  UUID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Timestamp"], ParentType, ContextType>;
  employees?: Resolver<Array<ResolversTypes["Adult"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddCompanyOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AddCompanyOutput"] = ResolversParentTypes["AddCompanyOutput"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "AddCompanySuccess" | "UniqueConstraintViolationFailure",
    ParentType,
    ContextType
  >;
}>;

export type AddCompanySuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AddCompanySuccess"] = ResolversParentTypes["AddCompanySuccess"]
> = ResolversObject<{
  company?: Resolver<ResolversTypes["Company"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditCompanyOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["EditCompanyOutput"] = ResolversParentTypes["EditCompanyOutput"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<"EditCompanySuccess", ParentType, ContextType>;
}>;

export type EditCompanySuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["EditCompanySuccess"] = ResolversParentTypes["EditCompanySuccess"]
> = ResolversObject<{
  company?: Resolver<ResolversTypes["Company"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddEmployeeOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AddEmployeeOutput"] = ResolversParentTypes["AddEmployeeOutput"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<"AddEmployeeSuccess", ParentType, ContextType>;
}>;

export type AddEmployeeSuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AddEmployeeSuccess"] = ResolversParentTypes["AddEmployeeSuccess"]
> = ResolversObject<{
  company?: Resolver<ResolversTypes["Company"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RemoveEmployeeOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["RemoveEmployeeOutput"] = ResolversParentTypes["RemoveEmployeeOutput"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "RemoveEmployeeSuccess",
    ParentType,
    ContextType
  >;
}>;

export type RemoveEmployeeSuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["RemoveEmployeeSuccess"] = ResolversParentTypes["RemoveEmployeeSuccess"]
> = ResolversObject<{
  company?: Resolver<ResolversTypes["Company"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FailureOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["FailureOutput"] = ResolversParentTypes["FailureOutput"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "UniqueConstraintViolationFailure",
    ParentType,
    ContextType
  >;
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  field?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type UniqueConstraintViolationFailureResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["UniqueConstraintViolationFailure"] = ResolversParentTypes["UniqueConstraintViolationFailure"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  field?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UuidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["UUID"], any> {
  name: "UUID";
}

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["EmailAddress"], any> {
  name: "EmailAddress";
}

export interface PhoneNumberScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["PhoneNumber"], any> {
  name: "PhoneNumber";
}

export type TimestampResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Timestamp"] = ResolversParentTypes["Timestamp"]
> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  modifiedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NumberFactResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["NumberFact"] = ResolversParentTypes["NumberFact"]
> = ResolversObject<{
  fact?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  number?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NumberFactSuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["NumberFactSuccess"] = ResolversParentTypes["NumberFactSuccess"]
> = ResolversObject<{
  numberFact?: Resolver<ResolversTypes["NumberFact"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NumberFactFailureResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["NumberFactFailure"] = ResolversParentTypes["NumberFactFailure"]
> = ResolversObject<{
  success?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NumberFactOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["NumberFactOutput"] = ResolversParentTypes["NumberFactOutput"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "NumberFactSuccess" | "NumberFactFailure",
    ParentType,
    ContextType
  >;
}>;

export type PersonResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Person"] = ResolversParentTypes["Person"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<"Adult" | "Underage", ParentType, ContextType>;
  UUID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  phone?: Resolver<
    Maybe<ResolversTypes["PhoneNumber"]>,
    ParentType,
    ContextType
  >;
  email?: Resolver<ResolversTypes["EmailAddress"], ParentType, ContextType>;
  birthday?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Timestamp"], ParentType, ContextType>;
}>;

export type AdultResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Adult"] = ResolversParentTypes["Adult"]
> = ResolversObject<{
  UUID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  phone?: Resolver<
    Maybe<ResolversTypes["PhoneNumber"]>,
    ParentType,
    ContextType
  >;
  email?: Resolver<ResolversTypes["EmailAddress"], ParentType, ContextType>;
  birthday?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Timestamp"], ParentType, ContextType>;
  employers?: Resolver<
    Array<ResolversTypes["Company"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnderageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Underage"] = ResolversParentTypes["Underage"]
> = ResolversObject<{
  UUID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  phone?: Resolver<
    Maybe<ResolversTypes["PhoneNumber"]>,
    ParentType,
    ContextType
  >;
  email?: Resolver<ResolversTypes["EmailAddress"], ParentType, ContextType>;
  birthday?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["Timestamp"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"]
> = ResolversObject<{
  personAdded?: SubscriptionResolver<
    ResolversTypes["Person"],
    "personAdded",
    ParentType,
    ContextType
  >;
}>;

export type AddPersonOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AddPersonOutput"] = ResolversParentTypes["AddPersonOutput"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "AddPersonSuccess" | "UniqueConstraintViolationFailure",
    ParentType,
    ContextType
  >;
}>;

export type AddPersonSuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AddPersonSuccess"] = ResolversParentTypes["AddPersonSuccess"]
> = ResolversObject<{
  person?: Resolver<ResolversTypes["Person"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditPersonOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["EditPersonOutput"] = ResolversParentTypes["EditPersonOutput"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<"EditPersonSuccess", ParentType, ContextType>;
}>;

export type EditPersonSuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["EditPersonSuccess"] = ResolversParentTypes["EditPersonSuccess"]
> = ResolversObject<{
  person?: Resolver<ResolversTypes["Person"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterSuccessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["RegisterSuccess"] = ResolversParentTypes["RegisterSuccess"]
> = ResolversObject<{
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterFailureResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["RegisterFailure"] = ResolversParentTypes["RegisterFailure"]
> = ResolversObject<{
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterFailureAlreadyExistsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["RegisterFailureAlreadyExists"] = ResolversParentTypes["RegisterFailureAlreadyExists"]
> = ResolversObject<{
  success?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["RegisterResponse"] = ResolversParentTypes["RegisterResponse"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "RegisterSuccess" | "RegisterFailure" | "RegisterFailureAlreadyExists",
    ParentType,
    ContextType
  >;
}>;

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = ResolversObject<{
  UUID?: Resolver<ResolversTypes["UUID"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AuthenticatedUserSuccess?: AuthenticatedUserSuccessResolvers<ContextType>;
  AuthenticatedUserFailure?: AuthenticatedUserFailureResolvers<ContextType>;
  AuthenticatedUserResponse?: AuthenticatedUserResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  LoginUserSuccess?: LoginUserSuccessResolvers<ContextType>;
  LoginUserFailure?: LoginUserFailureResolvers<ContextType>;
  LoginUserResponse?: LoginUserResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  AddCompanyOutput?: AddCompanyOutputResolvers<ContextType>;
  AddCompanySuccess?: AddCompanySuccessResolvers<ContextType>;
  EditCompanyOutput?: EditCompanyOutputResolvers<ContextType>;
  EditCompanySuccess?: EditCompanySuccessResolvers<ContextType>;
  AddEmployeeOutput?: AddEmployeeOutputResolvers<ContextType>;
  AddEmployeeSuccess?: AddEmployeeSuccessResolvers<ContextType>;
  RemoveEmployeeOutput?: RemoveEmployeeOutputResolvers<ContextType>;
  RemoveEmployeeSuccess?: RemoveEmployeeSuccessResolvers<ContextType>;
  FailureOutput?: FailureOutputResolvers<ContextType>;
  UniqueConstraintViolationFailure?: UniqueConstraintViolationFailureResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  PhoneNumber?: GraphQLScalarType;
  Timestamp?: TimestampResolvers<ContextType>;
  NumberFact?: NumberFactResolvers<ContextType>;
  NumberFactSuccess?: NumberFactSuccessResolvers<ContextType>;
  NumberFactFailure?: NumberFactFailureResolvers<ContextType>;
  NumberFactOutput?: NumberFactOutputResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  Adult?: AdultResolvers<ContextType>;
  Underage?: UnderageResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  AddPersonOutput?: AddPersonOutputResolvers<ContextType>;
  AddPersonSuccess?: AddPersonSuccessResolvers<ContextType>;
  EditPersonOutput?: EditPersonOutputResolvers<ContextType>;
  EditPersonSuccess?: EditPersonSuccessResolvers<ContextType>;
  RegisterSuccess?: RegisterSuccessResolvers<ContextType>;
  RegisterFailure?: RegisterFailureResolvers<ContextType>;
  RegisterFailureAlreadyExists?: RegisterFailureAlreadyExistsResolvers<ContextType>;
  RegisterResponse?: RegisterResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  authenticated?: AuthenticatedDirectiveResolver<any, any, ContextType>;
}>;

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<
  ContextType = Context
> = DirectiveResolvers<ContextType>;
