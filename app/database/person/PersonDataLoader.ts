import DataLoader from "dataloader";

import {
  AbstractDataLoaderBase,
  DataLoaderParams,
} from "~/database/AbstractDataLoader";
import {
  personQueries,
  PersonID,
  PersonTable,
} from "~/database/person/personQueries";
import { Maybe } from "~/generation/generated";

export type PersonLoader = DataLoader<PersonID, Maybe<PersonTable>>;

export class PersonDataLoader extends AbstractDataLoaderBase<PersonLoader> {
  protected createLoader(params: DataLoaderParams): PersonLoader {
    const personLoader: PersonLoader = new DataLoader(async (ids) => {
      const employees = await personQueries.getPersonsByIds({
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
