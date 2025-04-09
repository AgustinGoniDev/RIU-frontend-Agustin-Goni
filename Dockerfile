### STAGE 1: Build ###
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:ssr

### STAGE 2: Run ###
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/package.json /usr/src/app/package.json
RUN npm install --production

EXPOSE 4000
CMD ["node", "dist/heroes-app/server/main.js"]