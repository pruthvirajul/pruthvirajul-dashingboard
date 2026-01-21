# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json from Backend folder
COPY Backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY Backend/ .

# Expose port
EXPOSE 3048

# Start the server
CMD ["node", "server.js"]
