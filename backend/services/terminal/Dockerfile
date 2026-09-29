FROM node:22-alpine

# 1. Install Linux build tools required to compile native C++ modules like node-pty
RUN apk add --no-cache g++ make python3

WORKDIR /app

# 2. Copy dependency files first to leverage Docker caching
COPY package*.json ./

# 3. Install packages (this will now successfully compile node-pty using the build tools above)
RUN npm install

# 4. Copy the rest of the application files
COPY . .

# 5. Expose your port (adjust if your backend uses a different port)
EXPOSE 8000

# 6. Start the application
CMD ["npm", "start"]