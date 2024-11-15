# Use Node.js as the base image
FROM node:16-bullseye-slim as base

# Set the working directory
WORKDIR /home/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the app (if necessary, e.g., for TypeScript)
# RUN npm run build

# Stage for Ganache
FROM base as ganache

# Expose Ganache port
EXPOSE 8545

# Start Ganache CLI when the container starts
ENTRYPOINT ["npx", "ganache-cli", "--host", "127.0.0.1"]