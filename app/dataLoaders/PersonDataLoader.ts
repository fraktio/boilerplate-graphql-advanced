import DataLoader from "dataloader";

import { AbstractDataLoaderBase, DataLoaderParams } from "./AbstractDataLoader";

import { personDB, PersonID, PersonTable } from "~/database/personDB";

export type PersonLoader = DataLoader<PersonID, PersonTable | null>;

export class PersonDataLoader extends AbstractDataLoaderBase<PersonLoader> {
  protected createLoaders(params: DataLoaderParams): PersonLoader {
    const personLoader: PersonLoader = new DataLoader(async (ids) => {
      const employees = await personDB.getPersonsByIds({
        knex: params.knex,
        personIds: ids,
      });

      return ids.map(
        (id) => employees.find((employee) => employee.id === id) || null,
      );
    });

    return personLoader;
  }
}
