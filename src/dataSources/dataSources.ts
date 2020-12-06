import { CompanyDataSource } from "./CompanyDataSource";
import { EmployeeDataSource } from "./EmployeeDataSource";
import { PersonDataSource } from "./PersonDataSource";

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
