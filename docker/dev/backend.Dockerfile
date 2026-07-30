# Backend Node.js Development Dockerfile
FROM node:20-alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package manifests and install dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy source code
COPY backend ./

EXPOSE 5000

CMD ["npm", "run", "dev"]
