import { CompanyDataSource } from "./CompanyDataSource";
import { PersonDataSource } from "./PersonDataSource";
import { EmployeeDataSource } from "./employeeDataSource";

import { CreateDataSourceOptions } from "~/dataSources/DataSourceWithContext";
import { UserDataSource } from "~/dataSources/UserDataSource";

export type DataSources = {
  userDS: UserDataSource;
  personDS: PersonDataSource;
  employeeDS: EmployeeDataSource;
  companyDS: CompanyDataSource;
};

export const createDataSources = (
  opts: CreateDataSourceOptions,
): DataSources => ({
  userDS: new UserDataSource(opts),
  personDS: new PersonDataSource(opts),
  employeeDS: new EmployeeDataSource(opts),
  companyDS: new CompanyDataSource(opts),
});
