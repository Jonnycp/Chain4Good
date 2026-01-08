FROM node:20-alpine AS development-dependencies-env
COPY . /app
RUN apk add --no-cache python3 make g++
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
RUN apk add --no-cache python3 make g++
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

ARG VITE_BACKEND_URL
ARG VITE_HARDHAT_RPC_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_HARDHAT_RPC_URL=$VITE_HARDHAT_RPC_URL

RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
EXPOSE 5173
CMD ["npm", "run", "start"]