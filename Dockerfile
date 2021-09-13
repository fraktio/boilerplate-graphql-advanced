FROM node:14-slim@sha256:0840e64c86a203f079e5293d64338ae369f7260997debbc7da4c8186f04f9d4e as build
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci

# Copy local code to the container image and build
COPY . ./
RUN npm run build
RUN npm run postinstall
RUN npm prune --prodcution


FROM node:14-slim@sha256:0840e64c86a203f079e5293d64338ae369f7260997debbc7da4c8186f04f9d4e as release
WORKDIR /home/node
COPY --chown=node:node --from=build /app/dist ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
RUN ["rm", "-rf", "/app"]
USER node

ENV API_PORT=8080
EXPOSE 8080
CMD [ "node", "./main.js" ]
