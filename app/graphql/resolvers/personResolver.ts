import { Resolvers } from "~/generation/generated";
import {
  adultEmployersHandler,
  addPersonHandler,
  modifyPerson,
  personsHandler,
  personHandler,
} from "~/handlers/personHandler";

export const personResolver: Resolvers = {
  Adult: {
    async employers(person, _, { knex, dataLoaders }) {
      return await adultEmployersHandler({
        knex,
        personId: person.id,
        companyDL: dataLoaders.companyDL,
        companiesOfPersonDL: dataLoaders.companiesOfPersonDL,
      });
    },
  },

  Person: {
    __resolveType(person) {
      return person.birthday.diffNow("years").years < -18
        ? "Adult"
        : "Underage";
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
        throw new Error("Invalid person uuid");
      }

      return person;
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
        return { __typename: "AddPersonOutput", person: addedPerson.value };
      }

      throw addedPerson.failure;
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
        return { __typename: "EditPersonOutput", person: editPerson.value };
      }

      throw editPerson.failure;
    },
  },
};
