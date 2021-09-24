import { PersistedQueryNotFoundError } from "apollo-server-errors";
import {
  AuthenticationError,
  UserInputError,
  ValidationError,
  ApolloError,
} from "apollo-server-express";
import { ErrorRequestHandler } from "express";
import { GraphQLError, GraphQLFormattedError } from "graphql";

import { Config } from "~/config/config";

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  // need four parameters because it's an error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __,
  // eslint-disable-next-line max-params
) => {
  req.logger.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
};

export const apolloErrorHandler =
  (opts: { config: Config }) =>
  (error: GraphQLError): GraphQLFormattedError => {
    if (opts.config.env.apiExposeErrors) {
      return error;
    }

    if (error instanceof PersistedQueryNotFoundError) {
      // We want to compare error not error.originalError
      return error;
    }

    if (error.originalError instanceof AuthenticationError) {
      return new Error("Authentication error");
    }

    if (error.originalError instanceof UserInputError) {
      return new Error("UserInputError error");
    }

    if (error.originalError instanceof ValidationError) {
      return new Error("ValidationError error");
    }

    if (error.originalError instanceof ApolloError) {
      return new Error("ApolloError error");
    }

    return new Error("Internal server error");
  };
