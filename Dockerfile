# Multi-stage build for TOTAG Group Platform
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install all dependencies (including devDependencies required for vite build)
RUN npm ci

# Copy source code
COPY . .

# Build the frontend assets
RUN npm run build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Reuse dependencies installed in the matching Alpine build stage.
# Avoid a second npm install, which fails in the Coolify runtime stage.
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled frontend and backend server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

EXPOSE 3000

# Launch server entrypoint
CMD ["node", "dist/index.js"]
