import { ApolloError } from "apollo-server-core";

import { InvalidCursorFailure } from "~/handlers/failures/InvalidCursorFailure";
import { NotFoundFailure } from "~/handlers/failures/NotFoundFailure";
import { UniqueConstraintViolationFailure } from "~/handlers/failures/UniqueConstraintViolationFailure";

type FailureObject = InvalidCursorFailure | UniqueConstraintViolationFailure;

type ResolvedFailure = {
  __typename: string;
  field: string;
  message: string;
};

export const failureResolvers = {
  FailureOutput: {
    __resolveType(failureOutput: FailureObject): string {
      return resolveFailureType(failureOutput);
    },
  },
};

export function resolveFailureType(failureObject: FailureObject): string {
  switch (failureObject.constructor) {
    case InvalidCursorFailure:
      return "InvalidCursorFailure";

    case UniqueConstraintViolationFailure:
      return "UniqueConstraintViolationFailure";

    case NotFoundFailure:
      return "NotFoundFailure";
  }
  throw new ApolloError("Cannot determine FailureObject type");
}

export function resolveFailure(failureObject: FailureObject): ResolvedFailure {
  return {
    __typename: resolveFailureType(failureObject),
    field: failureObject.field,
    message: failureObject.message,
  };
}
