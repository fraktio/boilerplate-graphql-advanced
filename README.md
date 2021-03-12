# Graphql boilerplate - Advanced hardness

## Developing project

1. Dependencies

    1. Populate `.env` file with values found in `.env.example`
    2. `yarn`

2. Start database

    1. `docker-compose up`
    2. `yarn database:migrate:latest`

2. Start the api

    3. `yarn dev`

## Playground
  Playground is by default running @ `http://localhost:4000/graphql` 

## Production

1. Build with `yarn build`

- Prefer to make api domain url same as where the site is running
    - Cookies are the reason for this. This api is heavily secured

## Other documentation

- Please refer to the `/docs` folder for OpenOR API for designed api usage