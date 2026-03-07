# Variables
DOCKER_REGISTRY=pileax
WEB_IMAGE=$(DOCKER_REGISTRY)/pileax-web
API_IMAGE=$(DOCKER_REGISTRY)/pileax-api
COLLAB_IMAGE=$(DOCKER_REGISTRY)/pileax-collab
VERSION ?= 0.4.1

# Default target - show help
.DEFAULT_GOAL := help

# Backend Development Environment Setup
.PHONY: dev-setup prepare-docker prepare-web prepare-api

# Dev setup target
dev-setup: prepare-docker prepare-web prepare-api
	@echo "✅ Backend development environment setup complete!"

# Step 1: Prepare Docker middleware
prepare-docker:
	@echo "🐳 Setting up Docker middleware..."
	@cp -n docker/middleware.env.example docker/middleware.env 2>/dev/null || echo "Docker middleware.env already exists"
	@cd docker && docker compose -f docker-compose.middleware.yaml --env-file middleware.env up -d
	@echo "✅ Docker middleware started"

# Step 2: Prepare web environment
prepare-web:
	@echo "🌐 Setting up web environment..."
	@cp -n frontend/env/.env.example frontend/env/.env 2>/dev/null || echo "Web .env already exists"
	@cd frontend && yarn install
	@echo "✅ Web environment prepared (not started)"

# Step 3: Prepare API environment
prepare-api:
	@echo "🔧 Setting up API environment..."
	@cp -n backend/.env.example backend/.env 2>/dev/null || echo "API .env already exists"
	@cd backend && uv sync --dev
	@echo "✅ API environment prepared (not started)"

# Step 4: Prepare Collab environment
prepare-collab:
	@echo "🔧 Setting up Collab environment..."
	@cp -n backend/.env.example packages/collab/.env 2>/dev/null || echo "Collab .env already exists"
	@cd packages/collab && pnpm install
	@echo "✅ Collab environment prepared (not started)"

# Clean dev environment
dev-clean:
	@echo "⚠️  Stopping Docker containers..."
	@cd docker && docker compose -f docker-compose.middleware.yaml --env-file middleware.env down
	@echo "🗑️  Removing volumes..."
	@rm -rf docker/volumes/db
	@rm -rf docker/volumes/redis
	@rm -rf docker/volumes/plugin_daemon
	@rm -rf docker/volumes/weaviate
	@rm -rf backend/.cache/storage
	@echo "✅ Cleanup complete"

# Backend Code Quality Commands
format:
	@echo "🎨 Running ruff format..."
	@uv run --project backend --dev ruff format ./backend
	@echo "✅ Code formatting complete"

check:
	@echo "🔍 Running ruff check..."
	@uv run --project backend --dev ruff check ./backend
	@echo "✅ Code check complete"

lint:
	@echo "🔧 Running ruff format, check with fixes, and import linter..."
	@uv run --project backend --dev sh -c 'ruff format ./backend && ruff check --fix ./backend'
	@uv run --directory backend --dev lint-imports
	@echo "✅ Linting complete"

lint-web:
	@echo "🔧 Running eslint..."
	@yarn lint:frontend
	@echo "✅ Linting complete"

type-check:
	@echo "📝 Running type check with basedpyright..."
	@uv run --directory backend --dev basedpyright
	@echo "✅ Type check complete"

# Build Docker images
build-web:
	@echo "🌐 Building web Docker image: $(WEB_IMAGE):$(VERSION)..."
	docker build -t $(WEB_IMAGE):$(VERSION) -t $(WEB_IMAGE):latest ./frontend
	@echo "Web Docker image built successfully: $(WEB_IMAGE):$(VERSION)"

build-api:
	@echo "🥏 Building API Docker image: $(API_IMAGE):$(VERSION)..."
	docker build -t $(API_IMAGE):$(VERSION) -t $(API_IMAGE):latest ./backend
	@echo "API Docker image built successfully: $(API_IMAGE):$(VERSION)"

build-collab:
	@echo "🥏 Building Collab Docker image: $(COLLAB_IMAGE):$(VERSION)..."
	docker build \
		-t $(COLLAB_IMAGE):$(VERSION) \
		-t $(COLLAB_IMAGE):latest \
		-f ./packages/collab/Dockerfile ./packages
	@echo "Collab Docker image built successfully: $(COLLAB_IMAGE):$(VERSION)"

buildx-web:
	@echo "🌐 Building and pushing web Docker image (multi-arch): $(WEB_IMAGE):$(VERSION)..."
	docker buildx build --platform linux/amd64,linux/arm64 \
		-t $(WEB_IMAGE):$(VERSION) -t $(WEB_IMAGE):latest --push ./frontend
	@echo "Web Docker image built successfully: $(WEB_IMAGE):$(VERSION)"

buildx-api:
	@echo "🥏 Building and pushing API Docker image (multi-arch): $(API_IMAGE):$(VERSION)..."
	docker buildx build --platform linux/amd64,linux/arm64 \
 		-t $(API_IMAGE):$(VERSION) -t $(API_IMAGE):latest --push ./backend
	@echo "API Docker image built successfully: $(API_IMAGE):$(VERSION)"

buildx-collab:
	@echo "🥏 Building and pushing Collab Docker image (multi-arch): $(COLLAB_IMAGE):$(VERSION)..."
	docker buildx build --platform linux/amd64,linux/arm64 \
		-t $(COLLAB_IMAGE):$(VERSION) \
		-t $(COLLAB_IMAGE):latest \
		-f ./packages/collab/Dockerfile --push ./packages
	@echo "Collab Docker image built successfully: $(COLLAB_IMAGE):$(VERSION)"

# Push Docker images
push-web:
	@echo "📦 Pushing web Docker image: $(WEB_IMAGE):$(VERSION)..."
	docker push $(WEB_IMAGE):$(VERSION)
	docker push $(WEB_IMAGE):latest
	@echo "Web Docker image pushed successfully: $(WEB_IMAGE):$(VERSION)"

push-api:
	@echo "Pushing API Docker image: $(API_IMAGE):$(VERSION)..."
	docker push $(API_IMAGE):$(VERSION)
	docker push $(API_IMAGE):latest
	@echo "API Docker image pushed successfully: $(API_IMAGE):$(VERSION)"

push-collab:
	@echo "Pushing Collab Docker image: $(COLLAB_IMAGE):$(VERSION)..."
	docker push $(COLLAB_IMAGE):$(VERSION)
	docker push $(COLLAB_IMAGE):latest
	@echo "Collab Docker image pushed successfully: $(COLLAB_IMAGE):$(VERSION)"

# Build all images
build-all: build-web build-api build-collab

# Push all images
push-all: push-web push-api push-collab

build-push-api: build-api push-api
build-push-web: build-web push-web

# Build and push all images
build-push-all: build-all push-all
	@echo "All Docker images have been built and pushed."

buildx-all: buildx-web buildx-api buildx-collab
	@echo "All Docker images have been built and pushed."

# Help target
help:
	@echo "Development Setup Targets:"
	@echo "  make dev-setup        - Run all setup steps for backend dev environment"
	@echo "  make prepare-docker   - Set up Docker middleware"
	@echo "  make prepare-web      - Set up Web environment"
	@echo "  make prepare-api      - Set up API environment"
	@echo "  make prepare-collab   - Set up Collab environment"
	@echo "  make dev-clean        - Stop Docker middleware containers"
	@echo ""
	@echo "Backend Code Quality:"
	@echo "  make format           - Format code with ruff"
	@echo "  make check            - Check code with ruff"
	@echo "  make lint             - Format and fix code with ruff"
	@echo "  make lint-web         - Format and fix code with eslint"
	@echo "  make type-check       - Run type checking with basedpyright"
	@echo ""
	@echo "Docker Build Targets:"
	@echo "  make build-web        - Build Web Docker image"
	@echo "  make build-api        - Build API Docker image"
	@echo "  make build-collab     - Build Collab Docker image"
	@echo "  make build-all        - Build all Docker images"
	@echo "  make push-all         - Push all Docker images"
	@echo "  make build-push-all   - Build and push all Docker images"
	@echo ""
	@echo "Docker Build Multiple Platforms:"
	@echo "  make buildx-web       - Build and push Web Docker image"
	@echo "  make buildx-api       - Build and push API Docker image"
	@echo "  make buildx-collab    - Build and push Collab Docker image"
	@echo "  make buildx-all       - Build and push All Docker image"

# Phony targets
# --- Setup & Maintenance ---
.PHONY: dev-setup prepare-docker prepare-web prepare-api prepare-collab dev-clean help

# --- Code Quality & Linting ---
.PHONY: format check lint lint-web type-check

# --- Local Docker Build ---
.PHONY: build-web build-api build-collab build-all

# --- Docker Push ---
.PHONY: push-web push-api push-collab push-all

# --- Combined Build & Push Targets ---
.PHONY: build-push-api build-push-web build-push-all

# --- Multi-arch Build & Push (buildx) ---
.PHONY: buildx-web buildx-api buildx-collab buildx-all
