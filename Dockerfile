### STAGE 1: Build ###
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Instalamos pnpm globalmente
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:ssr

### STAGE 2: Run ###
FROM node:20-alpine
WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile

EXPOSE 4000
CMD ["node", "dist/heroes-app/server/main.js"]
