import { Express } from "express";
import { DocumentNode, print } from "graphql";
import request from "supertest";

export const gqlRequest = (
  server: Express,
  node: DocumentNode,
  variables?: Record<string, unknown>,
) => {
  if (!server) {
    throw new Error("Server not initialized!");
  }

  const params = { query: print(node), variables };

  return request(server).post("/graphql").send(params);
};
