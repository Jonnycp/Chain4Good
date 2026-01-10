FROM node:22-alpine AS development-dependencies-env
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build-env
RUN apk add --no-cache python3 make g++
WORKDIR /app

COPY . .
COPY --from=development-dependencies-env /app/node_modules ./node_modules

ARG VITE_BACKEND_URL
ARG VITE_HARDHAT_RPC_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_HARDHAT_RPC_URL=$VITE_HARDHAT_RPC_URL

RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build-env /app/build ./build
COPY --from=build-env /app/package.json ./package.json
COPY --from=build-env /app/node_modules ./node_modules
ENV PORT=5173
ENV HOST=0.0.0.0
EXPOSE 5173
CMD ["npm", "run", "start"]