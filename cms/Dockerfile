# Strapi v5 production image (official multi-stage pattern).
# Builds the admin, prunes dev deps, and runs the server in production mode.
# Used by the CD pipeline (GHCR image → Render web service) and locally via
# `docker build`.

FROM node:22-alpine AS build
WORKDIR /app
# Install deps first so the layer cache survives source changes.
COPY package.json package-lock.json ./
RUN npm ci
# Copy the app and build the admin bundle.
COPY . .
RUN npm run build
# Drop dev dependencies — the production image only needs runtime deps.
RUN npm prune --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
# A non-root user is good practice and required by some hosts (e.g. Render).
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app ./
USER app
EXPOSE 1337
CMD ["npm", "run", "start"]
