import { PersonDataLoader } from "~/database/person/PersonDataLoader";

export type DataLoaders = {
  personDL: PersonDataLoader;
};

export const createDataLoaders = () => ({
  personDL: new PersonDataLoader(),
});
