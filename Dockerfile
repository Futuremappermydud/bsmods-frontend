# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
FROM base AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --immutable --immutable-cache --check-cache
COPY . .
COPY ./prod.env ./.env
RUN yarn build

FROM base
WORKDIR /app

RUN \
  addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nodejs

COPY --chown=1001:1001 package.json ./
COPY --chown=1001:1001 --from=builder /app/node_modules ./node_modules
COPY --chown=1001:1001 --from=builder /app/build ./build

USER nodejs
EXPOSE 3000
ENV NODE_ENV=production
ARG GIT_VERSION=unknown
ARG GIT_REPO=unknown
ENV PUBLIC_GIT_VERSION=$GIT_VERSION
ENV PUBLIC_GIT_REPO=$GIT_REPO

CMD ["node", "build"]