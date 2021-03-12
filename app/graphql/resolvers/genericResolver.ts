import { Resolvers } from "~/generation/generated";

export const genericResolver: Resolvers = {
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
