FROM node:16-alpine as full-deps
WORKDIR /app
COPY ./package.json ./yarn.lock ./
RUN yarn

FROM node:16-alpine as prod-deps
WORKDIR /app
COPY ./package.json ./yarn.lock ./
RUN yarn --prod

FROM node:16-alpine as build
WORKDIR /app
COPY --from=full-deps /app/node_modules ./node_modules
COPY ./ ./
RUN yarn build

FROM node:16-alpine as release
WORKDIR /app
COPY --from=full-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./
EXPOSE 3000
ENTRYPOINT [ "node", "main.js" ]
