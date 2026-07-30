# Frontend React Development Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package manifests and install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy source code
COPY frontend ./

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
