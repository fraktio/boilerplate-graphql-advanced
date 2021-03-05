import { PersonDataLoader } from "./PersonDataLoader";

export type DataLoaders = {
  personDL: PersonDataLoader;
};

export const createDataLoaders = () => ({
  personDL: new PersonDataLoader(),
});
