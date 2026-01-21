# Login Page Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install http-server to serve static files
RUN npm install -g http-server

# Copy login page
COPY Login/index.html ./

# Expose port
EXPOSE 8152

# Start http-server
CMD ["http-server", "-p", "8152", "-c-1"]
