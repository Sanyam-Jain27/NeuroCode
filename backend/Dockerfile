FROM node:22-alpine

# Install native build tools required for node-pty and bash shell
RUN apk add --no-cache g++ make python3 bash

WORKDIR /app

# Copy package definitions and install dependencies
COPY package*.json ./
RUN npm install

COPY gateway/package*.json ./gateway/
RUN cd gateway && npm install

COPY services/auth/package*.json ./services/auth/
RUN cd services/auth && npm install

COPY services/project/package*.json ./services/project/
RUN cd services/project && npm install

COPY services/file/package*.json ./services/file/
RUN cd services/file && npm install

COPY services/ai/package*.json ./services/ai/
RUN cd services/ai && npm install

COPY services/terminal/package*.json ./services/terminal/
RUN cd services/terminal && npm install

COPY services/payment/package*.json ./services/payment/
RUN cd services/payment && npm install

# Copy application source code
COPY . .

# Render dynamically assigns PORT (defaults to 10000)
EXPOSE 10000 8000

CMD ["node", "index.js"]
