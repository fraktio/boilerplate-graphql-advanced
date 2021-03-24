import { Resolvers } from "~/generation/generated";
import { numberFactHandler } from "~/handlers/numberFactHandlers";

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
        return {
          __typename: "NumberFactFailure",
          success: false,
        };
      }

      return {
        __typename: "NumberFactSuccess",
        numberFact,
      };
    },
  },
};
