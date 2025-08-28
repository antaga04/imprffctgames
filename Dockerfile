# Imagen base de Node.js
FROM node:22.18.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# ENV COREPACK_ENABLE_PROMPT=false
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Fase de construcción
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

# Instalamos todas las dependencias para ambos proyectos, incluidas las devDependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod=false

# Fase del cliente
FROM base AS client
WORKDIR /usr/src/app/client 
COPY --from=build /usr/src/app /usr/src/app
EXPOSE 5173

# Comando para iniciar el servidor de desarrollo del cliente
CMD ["pnpm", "dev"]

# Fase del servidor
FROM base AS server
WORKDIR /usr/src/app/server  
COPY --from=build /usr/src/app /usr/src/app
EXPOSE 8000

# Comando para iniciar el servidor de desarrollo
CMD ["pnpm", "dev"]