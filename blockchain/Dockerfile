FROM node:22-alpine
RUN apk add --no-cache netcat-openbsd libc6-compat
# per attesa del deploy e compilazione solc
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x entrypoint.sh
EXPOSE 8545
ENTRYPOINT ["./entrypoint.sh"]