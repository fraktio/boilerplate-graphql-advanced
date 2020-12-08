import { loadFilesSync, mergeTypeDefs } from "graphql-tools";
import path from "path";

const typesArray = loadFilesSync(path.join(__dirname, "./schema"));

export const typeDefs = mergeTypeDefs(typesArray);
