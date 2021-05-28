import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import path from "path";

const schemaFolderLocation = path.join(process.cwd(), "./app/graphql/schema");

const typesArray = loadFilesSync<string>(schemaFolderLocation);

export const typeDefs = mergeTypeDefs(typesArray);
