FROM node:16-alpine as full-deps
WORKDIR /app
COPY ./package*.json ./
RUN npm install && npm cache clean --force

FROM node:16-alpine as prod-deps
WORKDIR /app
COPY ./package*.json ./
RUN npm install --only=prod && npm cache clean --force

FROM node:16-alpine as build
WORKDIR /app
COPY --from=full-deps /app/node_modules ./node_modules
COPY ./ ./
RUN npm run build

FROM node:16-alpine as release
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./
EXPOSE 4000
ENTRYPOINT [ "node", "main.js" ]
