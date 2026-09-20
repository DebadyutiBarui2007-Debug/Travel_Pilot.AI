# =========================================================
# Multi-Stage Dockerfile for TravelPilot Cloud Deployment
# Target: Google Cloud Run, AWS App Runner, ECS, Heroku, Local Docker
# =========================================================

# Stage 1: Build Phase
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors & install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build production assets
COPY . .
RUN npm run build

# Stage 2: Production Runtime Phase
FROM node:20-alpine AS runner

WORKDIR /app

# Set Production Environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package.json & install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled server bundle and static frontend assets from builder
COPY --from=builder /app/dist ./dist

# Expose standard port
EXPOSE 3000

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Launch production server
CMD ["node", "dist/server.cjs"]
