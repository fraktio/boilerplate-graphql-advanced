FROM node:16-slim@sha256:230c2b1d462d7dcb61cb7141b16b19aba1844a3679ee5d99e2d94a327cad85ea as build
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci

# Copy local code to the container image and build
COPY . ./
RUN npm run build
RUN npm run postinstall
RUN npm prune --production


FROM node:16-slim@sha256:230c2b1d462d7dcb61cb7141b16b19aba1844a3679ee5d99e2d94a327cad85ea as release
WORKDIR /home/node
COPY --chown=node:node --from=build /app/dist ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
RUN ["rm", "-rf", "/app"]
USER node

ENV API_PORT=8080
EXPOSE 8080
CMD [ "node", "./main.js" ]
