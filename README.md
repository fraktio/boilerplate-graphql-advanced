# Graphql boilerplate - Advanced

## Developing project

1. Dependencies

    1. Populate `.env.development` file with values found in `.env.example`
    2. `npm install` to install packages

2. Start database

    1. `docker-compose up` turn database on
    2. `npm run database:migrate:latest` add database structure
    3. `npm run seed` add mock data

2. Start the api

    3. `npm run dev`

3. When making `schema` changes run `npm run codegen` to generate types

## Playground
  - Test user credentials: `username` / `password`

  - Playground is by default running @ `http://localhost:4000/graphql`

## Utilities

- `/health` shows if the API is ready and running 200 OK

- `/version` shows the current version

## Deployment

#### AWS

1. Create aws api keys and add a profile in serverless configuration

2. `serverless deploy`

3. Wait...

4. During serverless deploy you can populate env variables in `AWS` => `AWS Systems Manager` => `Parameter Store`.

5. AWS Aurora(DB) connection????

6. Play and have fun