import { Resolvers } from "~/generation/generated";

export const fileResolver: Resolvers = {
  Mutation: {
    fileMetadata: async (_, { file }) => {
      const { encoding, filename, mimetype } = await file;

      return {
        __typename: "FileMetadataSuccess",
        metadata: {
          encoding,
          filename,
          mimetype,
        },
      };
    },
  },
};
