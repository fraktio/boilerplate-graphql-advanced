import { ApolloServerPlugin } from "apollo-server-plugin-base";
import type { Knex } from "knex";

import { DBSession, Transaction } from "~/database/connection";
import { Maybe } from "~/generation/generated";
import { Context } from "~/graphql/context";

export const mutationTransactions: ApolloServerPlugin<Context> = {
  requestDidStart: () => ({
    didResolveOperation: async (requestContext): Promise<void> => {
      if (requestContext.operation.operation === "mutation") {
        await requestContext.context.transaction.createTransaction();
      }
    },

    willSendResponse: async (requestContext): Promise<void> => {
      await requestContext.context.transaction.commitTransaction();
    },
  }),
};

export class DBTransaction {
  private knex: Knex;
  private transaction: Maybe<Knex.Transaction>;

  constructor(params: { knex: DBSession }) {
    this.knex = params.knex;
    this.transaction = null;
  }

  private getActiveTransaction(): Maybe<Transaction> {
    if (!this.transaction) {
      return null;
    }

    if (this.transaction.isCompleted()) {
      return null;
    }

    return this.transaction;
  }

  public async createTransaction(): Promise<Transaction> {
    const activeTransaction = this.getActiveTransaction();

    if (activeTransaction) {
      return activeTransaction;
    }

    this.transaction = await this.knex.transaction();

    return this.transaction;
  }

  public async commitTransaction(): Promise<void> {
    const activeTransaction = this.getActiveTransaction();

    if (!activeTransaction) {
      return;
    }

    activeTransaction.commit();
    this.transaction = null;
  }
}

export const createTransaction = (params: { knex: DBSession }): DBTransaction =>
  new DBTransaction(params);
