import { UserInputError } from "apollo-server-express";

import { Resolvers } from "~/generation/generated";
import {
  addPersonHandler,
  adultEmployersHandler,
  modifyPerson,
  personHandler,
  personsHandler,
  personsPaginationHandler,
} from "~/handlers/personHandler";

export enum Subscriptions {
  PERSON_ADDED = "personAdded",
}

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
    async employers(adult, _, { knex, dataLoaders }) {
      return await adultEmployersHandler({
        knex,
        personId: adult.id,
        companyDL: dataLoaders.companyDL,
        companiesOfPersonDL: dataLoaders.companiesOfPersonDL,
      });
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

    async cachedPerson(_, { input }, { knex, dataLoaders }) {
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

    async persons(_, { filters, sort, pagination }, { knex, dataLoaders }) {
      const personsResult = await personsPaginationHandler({
        knex,
        personDL: dataLoaders.personDL,
        filters: filters || undefined,
        sort: sort || undefined,
        pagination: pagination,
      });

      if (personsResult.success) {
        return {
          __typename: "PersonsPaginationResponse",
          ...personsResult.value,
        };
      }

      return {
        __typename: personsResult.failure.typename,
        message: personsResult.failure.message,
        field: personsResult.failure.field,
      };
    },

    async allPersons(_, __, { knex, dataLoaders }) {
      const persons = await personsHandler({
        knex,
        personDL: dataLoaders.personDL,
      });

      return persons;
    },
  },

  Mutation: {
    async addPerson(_, { input }, { knex, dataLoaders }) {
      const newPerson = {
        firstName: input.person.firstName,
        lastName: input.person.lastName,
        phone: input.person.phone || null,
        email: input.person.email,
        birthday: input.person.birthday,
        nationality: input.person.nationality,
        personalIdentityCode: input.person.personalIdentityCode,
        gender: input.person.gender,
      };

      const addedPerson = await addPersonHandler({
        knex,
        person: newPerson,
        personDL: dataLoaders.personDL,
      });

      if (addedPerson.success) {
        return { __typename: "AddPersonSuccess", person: addedPerson.value };
      }

      return {
        __typename: addedPerson.failure.typename,
        message: addedPerson.failure.message,
        field: addedPerson.failure.field,
      };
    },

    async editPerson(_, { input }, { knex, dataLoaders }) {
      const modifiedPerson = {
        firstName: input.person.firstName,
        lastName: input.person.lastName,
        phone: input.person.phone || null,
        email: input.person.email,
        birthday: input.person.birthday,
        nationality: input.person.nationality,
        personalIdentityCode: input.person.personalIdentityCode,
        gender: input.person.gender,
      };

      const editPerson = await modifyPerson({
        knex,
        personUUID: input.UUID,
        modifiedPerson,
        personDL: dataLoaders.personDL,
      });

      if (editPerson.success) {
        return { __typename: "EditPersonSuccess", person: editPerson.value };
      }

      return {
        __typename: editPerson.failure.typename,
        message: editPerson.failure.message,
        field: editPerson.failure.field,
      };
    },
  },
};
