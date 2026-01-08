FROM node:20-alpine
RUN apk add --no-cache netcat-openbsd
# attesa del deploy
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x entrypoint.sh
EXPOSE 8545
ENTRYPOINT ["./entrypoint.sh"]