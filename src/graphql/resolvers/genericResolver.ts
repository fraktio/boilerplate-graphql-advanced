import { Resolvers } from "~/generated/graphql";

export const gnericResolver: Resolvers = {
  Timestamp: {
    async modifiedAt(timestamp) {
      return timestamp.modifiedAt ?? null;
    },

    async createdAt(timestamp) {
      return timestamp.createdAt;
    },
  },

  FailureOutput: {
    __resolveType(registerFailureResponse) {
      return (
        registerFailureResponse.__typename ?? "UniqueConstraintViolationFailure"
      );
    },
  },
};
