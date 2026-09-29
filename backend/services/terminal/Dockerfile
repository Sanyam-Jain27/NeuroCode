FROM node:22-alpine

# Install Linux build tools required to compile native C++ modules like node-pty
RUN apk add --no-cache g++ make python3

WORKDIR /app

# Copy dependency files first to leverage Docker caching
COPY package*.json ./

# Install packages
RUN npm install

# Copy application code
COPY . .

# Expose terminal service port
EXPOSE 8005

# Start the application
CMD ["npm", "start"]