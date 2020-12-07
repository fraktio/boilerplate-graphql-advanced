import { UserInputError } from "apollo-server-express";

import { CompanyTable } from "~/dataSources/CompanyDataSource";
import { Resolvers } from "~/generated/graphql";

export const personResolver: Resolvers = {
  AddPersonOutput: {
    __resolveType(addPersonOutputResponse) {
      return (
        addPersonOutputResponse.__typename ?? "UniqueConstraintViolationFailure"
      );
    },
  },

  EditPersonOutput: {
    __resolveType(editPersonOutputResponse) {
      return editPersonOutputResponse.__typename ?? "EditPersonSuccess";
    },
  },

  Person: {
    __resolveType() {
      return "Adult";
    },
  },

  Adult: {
    async employers(company, _, { dataLoaders }) {
      const companiesUUIDs = await dataLoaders.companyDL.companiesOfPerson.load(
        company.UUID,
      );

      const companies = (await dataLoaders.companyDL.company.loadMany(
        companiesUUIDs,
      )) as CompanyTable[];

      return companies;
    },
  },

  Query: {
    async person(_, { input }, { dataSources }) {
      const person = await dataSources.personDS.getPerson({ uuid: input.UUID });

      if (!person) {
        throw new UserInputError("Invalid person uuid");
      }

      return person;
    },

    async persons(_, __, { dataSources }) {
      return await dataSources.personDS.getPersons();
    },
  },

  Mutation: {
    async addPerson(_, { input }, { dataSources }) {
      const person = await dataSources.personDS.createPerson({
        firstName: input.person.firstName,
        lastName: input.person.lastName,
        personalIdentityCode: input.person.personalIdentityCode,
        phone: input.person.phone || null,
        email: input.person.email,
        nationality: input.person.nationality,
        birthday: input.person.birthday,
      });

      return {
        __typename: "AddPersonSuccess",
        person,
      };
    },

    async editPerson(_, { input }, { dataSources }) {
      const person = await dataSources.personDS.updatePerson({
        uuid: input.UUID,
        firstName: input.person.firstName,
        lastName: input.person.lastName,
        personalIdentityCode: input.person.personalIdentityCode,
        phone: input.person.phone ?? null,
        email: input.person.email,
        nationality: input.person.nationality,
        birthday: input.person.birthday,
      });

      if (!person) {
        throw new Error("Invalid person uuid");
      }

      return {
        __typename: "EditPersonSuccess",
        person,
      };
    },
  },
};
