import { DataSource, DataSourceConfig } from "apollo-datasource";
import { AuthenticationError } from "apollo-server-express";
import Logger from "bunyan";
import Knex from "knex";

import { Config } from "~/config";
import { Context } from "~/graphql/context";

export interface CreateDataSourceOptions {
  config: Config;
  logger: Logger;
  knex: Knex;
}

export class DataSourceWithContext extends DataSource<Context> {
  protected config: Config;
  protected logger: Logger;
  protected knex: Knex;
  protected context: Context = (null as unknown) as Context;

  constructor(opts: CreateDataSourceOptions) {
    super();
    this.config = opts.config;
    this.logger = opts.logger;
    this.knex = opts.knex;
  }

  // This function is fired by apolloServer
  initialize(config: DataSourceConfig<Context>) {
    this.context = config.context;
  }

  private ensureAuthenticated() {
    if (!this.context.authenticatedUser) {
      this.logger.warn("User was not authenticated");
      throw new AuthenticationError("Unauthorized");
    }

    return this.context.authenticatedUser;
  }

  protected async ensureAuthenticatedUser() {
    const userAuth = this.ensureAuthenticated();

    const user = await this.context.dataSources.userDS.getUser({
      uuid: userAuth.uuid,
    });

    if (!user) {
      this.logger.warn("Authenticated user was not found");
      throw new AuthenticationError("Unauthorized");
    }

    return user;
  }
}
