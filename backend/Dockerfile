FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p uploads/projects uploads/spese/preventivi uploads/spese/proofs
EXPOSE 3000
CMD ["npm", "run", "start"]