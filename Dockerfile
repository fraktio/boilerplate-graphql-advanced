FROM node:16-slim@sha256:3ebf2875c188d22939c6ab080cfb1a4a6248cc86bae600ea8e2326aa03acdb8f as build
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci

# Copy local code to the container image and build
COPY . ./
RUN npm run build
RUN npm run postinstall
RUN npm prune --production


FROM node:16-slim@sha256:3ebf2875c188d22939c6ab080cfb1a4a6248cc86bae600ea8e2326aa03acdb8f as release
WORKDIR /home/node
COPY --chown=node:node --from=build /app/dist ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
RUN ["rm", "-rf", "/app"]
USER node

ENV API_PORT=8080
EXPOSE 8080
CMD [ "node", "./main.js" ]
