import { Resolvers } from "~/generation/generated";
import { numberFactHandler } from "~/handlers/numberFactHandlers";
import { toGraphqlFailure } from "~/utils/validation";

export const numberFactResolver: Resolvers = {
  NumberFactOutput: {
    __resolveType(registerFailureResponse) {
      return registerFailureResponse.__typename ?? "NumberFactFailure";
    },
  },

  Query: {
    numberFact: async (_, { input }, { dataSources }) => {
      const numberFact = await numberFactHandler({
        number: input.number,
        numberFactApi: dataSources.numberFactApi,
      });

      if (!numberFact) {
        return toGraphqlFailure("NumberFactFailure");
      }

      return {
        __typename: "NumberFactSuccess",
        numberFact,
      };
    },
  },
};
