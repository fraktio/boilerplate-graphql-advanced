import { Gender } from "~/database/person/personQueries";
import { Resolvers } from "~/generation/generated";
import {
  addPersonHandler
  // UNCOMMENT ME @ STEP 2 adultEmployersHandler,
  modifyPerson,
  personsHandler,
} from "~/handlers/personHandler";

export const personResolver: Resolvers = {
  /* UNCOMMENT ME @ STEP 2
  Person: {
    async employers(person, _, { knex, dataLoaders }) {
      return await adultEmployersHandler({
        knex,
        personId: person.id,
        companyDL: dataLoaders.companyDL,
        companiesOfPersonDL: dataLoaders.companiesOfPersonDL,
      });
    },
  },
  */
  Query: {
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
        gender: Gender.Other,
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
        gender: Gender.Other,
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
