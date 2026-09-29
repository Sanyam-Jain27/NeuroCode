FROM node:22-alpine

# Install build tools for node-pty and bash shell
RUN apk add --no-cache g++ make python3 bash

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8005

CMD ["npm", "start"]