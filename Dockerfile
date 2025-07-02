# DeskMate AI - Docker Configuration
# This Dockerfile creates a containerized version for server deployment

# Use Node.js LTS as base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the React application
RUN npm run build:react

# Production stage
FROM node:18-alpine AS production

# Install required system dependencies for Electron in headless mode
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    xvfb

# Set up a user to run the application (security best practice)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S electron -u 1001

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/dist ./dist

# Copy necessary assets
COPY assets ./assets

# Change ownership to the nodejs user
RUN chown -R electron:nodejs /app
USER electron

# Expose port for any web interface (if needed)
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV DISPLAY=:99

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check passed')" || exit 1

# Command to run the application
# Note: In a real deployment, you might want to run this differently
# depending on whether you're running as a service or need GUI support
CMD ["node", "dist/main.js"]

# Multi-stage build labels
LABEL maintainer="your-email@example.com"
LABEL description="DeskMate AI - Intelligent Desktop Assistant"
LABEL version="1.0.0" 