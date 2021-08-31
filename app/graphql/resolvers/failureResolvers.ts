import { ApolloError } from "apollo-server-core";

import { InvalidCursorFailure } from "~/handlers/failures/InvalidCursorFailure";
import { NotFoundFailure } from "~/handlers/failures/NotFoundFailure";
import { UniqueConstraintViolationFailure } from "~/handlers/failures/UniqueConstraintViolationFailure";

type FailureObject = InvalidCursorFailure | UniqueConstraintViolationFailure;

enum FailureTypes {
  InvalidCursorFailure,
  UniqueConstraintViolationFailure,
  NotFoundFailure,
}

type ResolvedFailure = {
  __typename: FailureTypes;
  field: string;
  message: string;
};

export const failureResolvers = {
  FailureOutput: {
    __resolveType(failureOutput: FailureObject): FailureTypes {
      return resolveFailureType(failureOutput);
    },
  },
};

export function resolveFailureType(failureObject: FailureObject): FailureTypes {
  switch (failureObject.constructor) {
    case InvalidCursorFailure:
      return FailureTypes.InvalidCursorFailure;

    case UniqueConstraintViolationFailure:
      return FailureTypes.UniqueConstraintViolationFailure;

    case NotFoundFailure:
      return FailureTypes.NotFoundFailure;
  }
  throw new ApolloError("Cannot determine FailureObject type");
}

export function resolveFailure(failureObject: FailureObject): ResolvedFailure {
  const type = resolveFailureType(failureObject);

  return {
    __typename: type,
    field: failureObject.field,
    message: failureObject.message,
  };
}
