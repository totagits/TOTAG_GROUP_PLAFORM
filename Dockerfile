# Multi-stage build for TOTAG Group Platform
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install all dependencies (including devDependencies required for vite build)
RUN npm install

# Copy source code
COPY . .

# Build the frontend assets
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package management files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled frontend and backend server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

EXPOSE 3000

# Launch server entrypoint
CMD ["/usr/local/bin/node", "server/index.js"]
