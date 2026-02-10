# --- Stage 1: Base ---
# Use node:20-slim to keep the image size minimal
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Enable corepack to use pnpm without manual installation
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# --- Stage 2: Build ---
FROM base AS builder
# Copy monorepo configuration files from the context root (./packages)
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the specific package manifest
# Path is relative to the context (./packages), so we use 'collab/'
COPY collab/package.json ./collab/

# Install all dependencies including devDependencies for the build process
# Using --filter to only install dependencies relevant to the collab service
RUN pnpm install --filter collab... --frozen-lockfile

# Copy the package source code
COPY collab ./collab

# Build the project to generate ESM artifacts in dist/
WORKDIR /app/collab
RUN pnpm run build

# --- Stage 3: Runner ---
FROM node:20-slim AS runner
WORKDIR /app
# Set environment to production for optimized performance
ENV NODE_ENV=production

# Re-enable pnpm for installing production-only dependencies
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the necessary build artifacts and package manifest from builder stage
COPY --from=builder /app/collab/dist ./dist
COPY --from=builder /app/collab/package.json ./package.json

# Install only production dependencies to keep the final image clean
RUN pnpm install --prod --no-frozen-lockfile

# The service uses process.env.COLLAB_PORT, so no EXPOSE is hardcoded here.
# This ensures maximum flexibility for different deployment environments.

# Start the Hocuspocus collaboration server
CMD ["node", "dist/server.js"]
