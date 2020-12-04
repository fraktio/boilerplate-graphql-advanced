import { DateTime } from 'luxon';
import { PhoneNumber } from 'google-libphonenumber';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { MovieModel, GenreModel, PersonModel } from '../models';
import { Context } from '../graphql/context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: DateTime;
  DateTime: DateTime;
  PhoneNumber: PhoneNumber;
  EmailAddress: string;
  UUID: any;
  HexColorCode: any;
};


export type Session = {
  __typename?: 'Session';
  uuid?: Maybe<Scalars['UUID']>;
};

export type Query = {
  __typename?: 'Query';
  authenticatedUser: User;
  genre: Genre;
  genres: Array<Genre>;
  movie: Movie;
  movies: Array<Movie>;
  page?: Maybe<Page>;
  person: Person;
  persons: Array<Person>;
};


export type QueryGenreArgs = {
  input: GenreInput;
};


export type QueryMovieArgs = {
  input: MovieInput;
};


export type QueryPageArgs = {
  input: PageInput;
};


export type QueryPersonArgs = {
  input: PersonInput;
};

export type LoginUserSuccess = {
  __typename?: 'LoginUserSuccess';
  user: User;
};

export type LoginUserFailure = {
  __typename?: 'LoginUserFailure';
  success: Scalars['Boolean'];
};

export type LoginUserResponse = LoginUserSuccess | LoginUserFailure;

export type LoginUserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginUserResponse;
  logout: Scalars['Boolean'];
  register: RegisterResponse;
};


export type MutationLoginArgs = {
  input: LoginUserInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type Person = {
  __typename?: 'Person';
  uuid: Scalars['UUID'];
  firstName: Scalars['String'];
  familyName: Scalars['String'];
  birthday: Scalars['Date'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  movies: Array<Movie>;
};

export type PersonInput = {
  uuid: Scalars['UUID'];
};







export type Genre = {
  __typename?: 'Genre';
  uuid: Scalars['UUID'];
  type: Scalars['String'];
  movies: Array<Movie>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type GenreInput = {
  uuid: Scalars['UUID'];
};

export type Movie = {
  __typename?: 'Movie';
  uuid: Scalars['UUID'];
  title: Scalars['String'];
  rating: Scalars['Int'];
  genres: Array<Genre>;
  cast: Array<Person>;
  releaseDate: Scalars['Date'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type MovieInput = {
  uuid: Scalars['UUID'];
};

export type Page = {
  __typename?: 'Page';
  slug: Scalars['String'];
};

export type PageInput = {
  slug: Scalars['String'];
};

export type RegisterSuccess = {
  __typename?: 'RegisterSuccess';
  success: Scalars['Boolean'];
};

export type RegisterFailure = {
  __typename?: 'RegisterFailure';
  success: Scalars['Boolean'];
};

export type RegisterFailureAlreadyExists = {
  __typename?: 'RegisterFailureAlreadyExists';
  success: Scalars['Boolean'];
};

export type RegisterResponse = RegisterSuccess | RegisterFailure | RegisterFailureAlreadyExists;

export type RegisterInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['EmailAddress'];
  phoneNumber: Scalars['PhoneNumber'];
};

export type User = {
  __typename?: 'User';
  uuid: Scalars['UUID'];
  username: Scalars['String'];
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
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
  Session: ResolverTypeWrapper<Session>;
  Query: ResolverTypeWrapper<{}>;
  LoginUserSuccess: ResolverTypeWrapper<LoginUserSuccess>;
  LoginUserFailure: ResolverTypeWrapper<LoginUserFailure>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  LoginUserResponse: ResolversTypes['LoginUserSuccess'] | ResolversTypes['LoginUserFailure'];
  LoginUserInput: LoginUserInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  Person: ResolverTypeWrapper<PersonModel>;
  PersonInput: PersonInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  PhoneNumber: ResolverTypeWrapper<Scalars['PhoneNumber']>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  HexColorCode: ResolverTypeWrapper<Scalars['HexColorCode']>;
  Genre: ResolverTypeWrapper<GenreModel>;
  GenreInput: GenreInput;
  Movie: ResolverTypeWrapper<MovieModel>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  MovieInput: MovieInput;
  Page: ResolverTypeWrapper<Page>;
  PageInput: PageInput;
  RegisterSuccess: ResolverTypeWrapper<RegisterSuccess>;
  RegisterFailure: ResolverTypeWrapper<RegisterFailure>;
  RegisterFailureAlreadyExists: ResolverTypeWrapper<RegisterFailureAlreadyExists>;
  RegisterResponse: ResolversTypes['RegisterSuccess'] | ResolversTypes['RegisterFailure'] | ResolversTypes['RegisterFailureAlreadyExists'];
  RegisterInput: RegisterInput;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Session: Session;
  Query: {};
  LoginUserSuccess: LoginUserSuccess;
  LoginUserFailure: LoginUserFailure;
  Boolean: Scalars['Boolean'];
  LoginUserResponse: ResolversParentTypes['LoginUserSuccess'] | ResolversParentTypes['LoginUserFailure'];
  LoginUserInput: LoginUserInput;
  String: Scalars['String'];
  Mutation: {};
  Person: PersonModel;
  PersonInput: PersonInput;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  PhoneNumber: Scalars['PhoneNumber'];
  EmailAddress: Scalars['EmailAddress'];
  UUID: Scalars['UUID'];
  HexColorCode: Scalars['HexColorCode'];
  Genre: GenreModel;
  GenreInput: GenreInput;
  Movie: MovieModel;
  Int: Scalars['Int'];
  MovieInput: MovieInput;
  Page: Page;
  PageInput: PageInput;
  RegisterSuccess: RegisterSuccess;
  RegisterFailure: RegisterFailure;
  RegisterFailureAlreadyExists: RegisterFailureAlreadyExists;
  RegisterResponse: ResolversParentTypes['RegisterSuccess'] | ResolversParentTypes['RegisterFailure'] | ResolversParentTypes['RegisterFailureAlreadyExists'];
  RegisterInput: RegisterInput;
  User: User;
}>;

export type AuthenticatedDirectiveArgs = {  };

export type AuthenticatedDirectiveResolver<Result, Parent, ContextType = Context, Args = AuthenticatedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type SessionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = ResolversObject<{
  uuid?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  authenticatedUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  genre?: Resolver<ResolversTypes['Genre'], ParentType, ContextType, RequireFields<QueryGenreArgs, 'input'>>;
  genres?: Resolver<Array<ResolversTypes['Genre']>, ParentType, ContextType>;
  movie?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<QueryMovieArgs, 'input'>>;
  movies?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  page?: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<QueryPageArgs, 'input'>>;
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType, RequireFields<QueryPersonArgs, 'input'>>;
  persons?: Resolver<Array<ResolversTypes['Person']>, ParentType, ContextType>;
}>;

export type LoginUserSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginUserSuccess'] = ResolversParentTypes['LoginUserSuccess']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginUserFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginUserFailure'] = ResolversParentTypes['LoginUserFailure']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginUserResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginUserResponse'] = ResolversParentTypes['LoginUserResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LoginUserSuccess' | 'LoginUserFailure', ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  login?: Resolver<ResolversTypes['LoginUserResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['RegisterResponse'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
}>;

export type PersonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = ResolversObject<{
  uuid?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  familyName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  birthday?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  movies?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface PhoneNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PhoneNumber'], any> {
  name: 'PhoneNumber';
}

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface HexColorCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HexColorCode'], any> {
  name: 'HexColorCode';
}

export type GenreResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Genre'] = ResolversParentTypes['Genre']> = ResolversObject<{
  uuid?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  movies?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MovieResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Movie'] = ResolversParentTypes['Movie']> = ResolversObject<{
  uuid?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  genres?: Resolver<Array<ResolversTypes['Genre']>, ParentType, ContextType>;
  cast?: Resolver<Array<ResolversTypes['Person']>, ParentType, ContextType>;
  releaseDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = ResolversObject<{
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterSuccess'] = ResolversParentTypes['RegisterSuccess']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'RegisterSuccess' | 'RegisterFailure' | 'RegisterFailureAlreadyExists', ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  uuid?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Session?: SessionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  LoginUserSuccess?: LoginUserSuccessResolvers<ContextType>;
  LoginUserFailure?: LoginUserFailureResolvers<ContextType>;
  LoginUserResponse?: LoginUserResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  PhoneNumber?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  Genre?: GenreResolvers<ContextType>;
  Movie?: MovieResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
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
export type IDirectiveResolvers<ContextType = Context> = DirectiveResolvers<ContextType>;