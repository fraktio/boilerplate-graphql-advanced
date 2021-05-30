import { NumberFactApi } from "~/services/NumberFactApi";

export type DataSources = {
  numberFactApi: NumberFactApi;
};

export type DataSourcesInContext = {
  dataSources: DataSources;
};

export const createDataSources = (): DataSources => ({
  numberFactApi: new NumberFactApi(),
});
