FROM node:14-slim@sha256:c097018182469e8391a577955ef25f0d2ac9b0b19179835d621df48c978fa24d as build
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci

# Copy local code to the container image and build
COPY . ./
RUN npm run build
RUN npm run postinstall
RUN npm prune --prodcution


FROM node:14-slim@sha256:c097018182469e8391a577955ef25f0d2ac9b0b19179835d621df48c978fa24d as release
WORKDIR /home/node
COPY --chown=node:node --from=build /app/dist ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
RUN ["rm", "-rf", "/app"]
USER node

ENV API_PORT=8080
EXPOSE 8080
CMD [ "node", "./main.js" ]
