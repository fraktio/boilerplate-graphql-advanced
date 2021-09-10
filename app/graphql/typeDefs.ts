import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadTypedefsSync } from "@graphql-tools/load";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { DocumentNode } from "graphql";
import path from "path";

const schemaFolderLocation = path.join(
  process.cwd(),
  "./app/graphql/schema/**/*.graphql",
);

const sources = loadTypedefsSync(schemaFolderLocation, {
  loaders: [new GraphQLFileLoader()],
});

const typesArray = sources
  .map((source) => source.document)
  .filter((document) => !!document) as DocumentNode[];

export const typeDefs = mergeTypeDefs(
  typesArray.filter((document) => !!document),
);
