import { UserInputError } from "apollo-server-express";

import {
  addPersonHandler,
  adultEmployersHandler,
  modifyPerson,
  personHandler,
  personsHandler,
} from "./personHandler";

import { Resolvers } from "~/graphql/generation/generated";

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
    async person(_, { input }, { knex }) {
      const person = await personHandler({ knex, personUUID: input.UUID });

      if (!person) {
        throw new UserInputError("Invalid person uuid");
      }

      return person;
    },

    async persons(_, __, { knex }) {
      return await personsHandler({ knex });
    },
  },

  Mutation: {
    async addPerson(_, { input }, { knex }) {
      const newPerson = {
        firstName: input.person.firstName,
        lastName: input.person.lastName,
        personalIdentityCode: input.person.personalIdentityCode,
        phone: input.person.phone || null,
        email: input.person.email,
        nationality: input.person.nationality,
        birthday: input.person.birthday,
      };

      const person = addPersonHandler({ knex, person: newPerson });

      return { __typename: "AddPersonSuccess", person };
    },

    async editPerson(_, { input }, { knex }) {
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
      });

      if (!person) {
        throw new Error("Invalid person uuid");
      }

      return { __typename: "EditPersonSuccess", person };
    },
  },
};
