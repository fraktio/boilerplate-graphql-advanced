FROM node:16-slim@sha256:af6f241029c4d63107c6ccbbd030c44d331786d724bd9c2e615edf46deab58e2 as build
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci

# Copy local code to the container image and build
COPY . ./
RUN npm run build
RUN npm run postinstall
RUN npm prune --prodcution


FROM node:16-slim@sha256:af6f241029c4d63107c6ccbbd030c44d331786d724bd9c2e615edf46deab58e2 as release
WORKDIR /home/node
COPY --chown=node:node --from=build /app/dist ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
RUN ["rm", "-rf", "/app"]
USER node

ENV API_PORT=8080
EXPOSE 8080
CMD [ "node", "./main.js" ]
