# Docker Image for ink-and-insights backend server

# Stage 0: install the base dependencies
FROM node:22.14-bookworm AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci
###################################################################################

# Stage 1: copy source codes
FROM node:22.14-bookworm AS build

WORKDIR /app

COPY --from=dependencies /app ./

COPY ./src ./src

COPY ./prisma ./prisma

###################################################################################

# Stage 2: Set evnrionment and deploy
FROM node:22.14-bookworm AS deploy

ENV PORT=8080

# Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
ENV NPM_CONFIG_COLOR=false

# Copy the files
COPY --from=build /app ./

HEALTHCHECK --interval=30m --timeout=30s --start-period=5s --retries=3 \
 CMD curl --fail http://localhost:8080 || exit 1

# Generate Prisma Client
RUN npx prisma generate

# Start the container by running our server
CMD ["node", "./src/index.js"]

# We run our service on port 8080
EXPOSE ${PORT}

