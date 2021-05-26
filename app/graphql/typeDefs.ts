import { loadFilesSync, mergeTypeDefs } from "graphql-tools";
import path from "path";

const typesArray = loadFilesSync(path.join(process.cwd(), "./app/schema"));

export const typeDefs = mergeTypeDefs(typesArray);
