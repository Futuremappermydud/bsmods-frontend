FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install --immutable --immutable-cache --check-cache
COPY . .
COPY ./prod.env ./.env
RUN yarn build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]