# Etapa de compilación
FROM node:20-alpine AS build

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar archivos de configuración de pnpm
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN pnpm run build

# Etapa de ejecución
FROM node:20-alpine

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar los archivos necesarios de la etapa de compilación
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./

# Instalar solo las dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Exponer el puerto
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["node", "dist/riu-frontend-challenge-agustin-goni/server/server.mjs"]