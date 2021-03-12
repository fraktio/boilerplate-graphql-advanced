import { UserInputError } from "apollo-server-express";

import {
  addPersonHandler,
  adultEmployersHandler,
  modifyPerson,
  personHandler,
  personsHandler,
} from "../../handlers/personHandler";

import { Resolvers } from "~/generation/generated";

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
    async employers(adult, _, { knex }) {
      return await adultEmployersHandler({ knex, personId: adult.id });
    },
  },

  Query: {
    async person(_, { input }, { knex, dataLoaders }) {
      const person = await personHandler({
        knex,
        personUUID: input.UUID,
        personDL: dataLoaders.personDL,
      });

      if (!person) {
        throw new UserInputError("Invalid person uuid");
      }

      return person;
    },

    async persons(_, __, { knex, dataLoaders }) {
      return await personsHandler({ knex, personDL: dataLoaders.personDL });
    },
  },

  Mutation: {
    async addPerson(_, { input }, { knex, dataLoaders }) {
      const newPerson = {
        firstName: input.person.firstName,
        lastName: input.person.lastName,
        personalIdentityCode: input.person.personalIdentityCode,
        phone: input.person.phone || null,
        email: input.person.email,
        nationality: input.person.nationality,
        birthday: input.person.birthday,
      };

      const person = addPersonHandler({
        knex,
        person: newPerson,
        personDL: dataLoaders.personDL,
      });

      return { __typename: "AddPersonSuccess", person };
    },

    async editPerson(_, { input }, { knex, dataLoaders }) {
      const modifiedPerson = {
        firstName: input.person.firstName,
        lastName: input.person.lastName,
        personalIdentityCode: input.person.personalIdentityCode,
        phone: input.person.phone ?? null,
        email: input.person.email,
        nationality: input.person.nationality,
        birthday: input.person.birthday,
      };

      const person = await modifyPerson({
        knex,
        personUUID: input.UUID,
        modifiedPerson,
        personDL: dataLoaders.personDL,
      });

      if (!person) {
        throw new Error("Invalid person uuid");
      }

      return { __typename: "EditPersonSuccess", person };
    },
  },
};
