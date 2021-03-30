import { gql } from "apollo-server-express";

import { createUUID } from "~/database/tables";
import { createTestServer } from "~/tests/createTestServer";
import { gqlRequest } from "~/tests/graphqlTestUtils";
import { registerTestHandlers } from "~/tests/registerTestHandlers";
import { createDatabaseCompany } from "~/tests/testDatabase";

const getCompanyQuery = gql`
  query GetCompany($input: CompanyQuery!) {
    company(input: $input) {
      __typename
      UUID
      name
    }
  }
`;

const getCompaniesQuery = gql`
  query GetCompanies {
    companies {
      __typename
      UUID
      name
    }
  }
`;

const addCompanyMutation = gql`
  mutation AddCompany($input: AddCompanyInput!) {
    addCompany(input: $input) {
      __typename
      ...AddCompanySuccess
    }
  }

  fragment AddCompanySuccess on AddCompanySuccess {
    company {
      __typename
      UUID
      name
    }
  }
`;

const { app, knex } = createTestServer();
registerTestHandlers({ knex });

describe("Graphql / endpoints", () => {
  it("company / success", async () => {
    const NAME = "Random name";
    const company = await createDatabaseCompany({
      knex,
      overrides: { name: NAME },
    });
    const params = {
      input: { UUID: company.UUID },
    };
    const { body } = await gqlRequest(app, getCompanyQuery, params);

    expect(body.data.company.__typename).toBe("Company");
    expect(body.data.company.UUID).toBe(company.UUID);
  });

  it("company / failure", async () => {
    const params = {
      input: { UUID: createUUID() },
    };
    const { body } = await gqlRequest(app, getCompanyQuery, params);

    expect(body.data).toBe(null);
    expect(Array.isArray(body.errors)).toBeTruthy();
  });

  it("companies / success", async () => {
    const NAME1 = "Random name1";
    const company1 = await createDatabaseCompany({
      knex,
      overrides: { name: NAME1 },
    });
    const NAME2 = "Random name2";
    const company2 = await createDatabaseCompany({
      knex,
      overrides: { name: NAME2 },
    });

    const { body } = await gqlRequest(app, getCompaniesQuery);

    expect(Array.isArray(body.data.companies)).toBeTruthy();

    const [first, second] = body.data.companies;
    expect(first.__typename).toBe("Company");
    expect(first.UUID).toBe(company1.UUID);
    expect(first.name).toBe(NAME1);

    expect(second.__typename).toBe("Company");
    expect(second.UUID).toBe(company2.UUID);
    expect(second.name).toBe(NAME2);
  });

  it("createCompany / success", async () => {
    const NAME = "Company name";
    const params = { input: { company: { name: NAME } } };
    const { body } = await gqlRequest(app, addCompanyMutation, params);

    expect(body.data.addCompany.__typename).toBe("AddCompanySuccess");
    expect(body.data.addCompany.company.name).toBe(NAME);
    expect(body.data.addCompany.company.__typename).toBe("Company");
  });
});
