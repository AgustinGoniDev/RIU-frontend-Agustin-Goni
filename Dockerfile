### STAGE 1: Build ###
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build:ssr

### STAGE 2: Run ###
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml
RUN pnpm install --production

EXPOSE 4000
CMD ["node", "dist/heroes-app/server/main.js"]