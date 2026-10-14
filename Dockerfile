# ===================================================
# Multi-Stage Dockerfile: BUMDES Waskita Wijaya
# Production-ready container image with Node 22 Alpine
# ===================================================

# Stage 1: Build & Compile
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json ./
RUN npm install

# Copy application source code
COPY . .

# Run build (Vite client SPA + esbuild server bundle)
RUN npm run build

# Stage 2: Production Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install minimal runtime dependencies
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy built distribution assets and server bundle
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Create data directory for uploads and atomic storage with proper permissions
RUN mkdir -p /app/data/uploads /app/data/backups && \
    chown -R node:node /app

# Run as non-privileged node user for container security
USER node

# Expose HTTP port
EXPOSE 3000

# Health check configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the Node.js production server
CMD ["node", "dist/server.cjs"]
