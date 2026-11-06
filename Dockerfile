# TOTAG Kitchen staging-friendly multi-stage Node build
# Keep this isolated on the Kitchen feature branch until launch checks pass.
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs kitchen

# Reuse the dependencies that passed the build; avoid a second npm install.
COPY --from=builder --chown=kitchen:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=kitchen:nodejs /app/package*.json ./
COPY --from=builder --chown=kitchen:nodejs /app/dist ./dist

USER kitchen
EXPOSE 3000
CMD ["node", "dist/index.js"]
