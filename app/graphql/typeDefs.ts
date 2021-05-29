import { loadFilesSync, mergeTypeDefs } from "graphql-tools";
import path from "path";

const schemaFolderLocation = path.join(process.cwd(), "./app/graphql/schema");

const typesArray = loadFilesSync<string>(schemaFolderLocation);

export const typeDefs = mergeTypeDefs(typesArray);
