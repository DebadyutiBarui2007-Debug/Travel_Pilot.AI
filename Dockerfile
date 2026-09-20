# =========================================================
# Production Dockerfile for TravelPilot Cloud Deployment
# Compatible with: Google Cloud Run, AWS App Runner / ECS, Docker Desktop
# =========================================================

# Stage 1: Build Phase
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and build production artifacts
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Configure Production Environment
ENV NODE_ENV=production
ENV PORT=3000

# Install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled bundles and static distribution from builder
COPY --from=builder /app/dist ./dist

# Non-root user execution for container security
USER node

# Expose container ingress port
EXPOSE 3000

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/api/health || exit 1

# Launch production server
CMD ["node", "dist/server.cjs"]
