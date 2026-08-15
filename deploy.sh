#!/bin/bash
# ==============================================================================
# METRIK MEDIA INDONESIA - SINGLE-SERVER PRODUCTION DEPLOY SCRIPT
# ==============================================================================

set -e

echo "🚀 Starting Metrik Media Indonesia Deployment..."

# 1. Check if .env exists
if [ ! -f ".env" ]; then
    if [ -f ".env.docker" ]; then
        echo "📄 .env not found. Copying .env.docker to .env..."
        cp .env.docker .env
    else
        echo "❌ Error: .env file missing! Please copy .env.example or .env.docker to .env"
        exit 1
    fi
fi

# 2. Pull latest git changes (if in git repo)
if [ -d ".git" ]; then
    echo "📥 Pulling latest git repository updates..."
    git pull origin main || git pull origin master || echo "⚠️ Git pull skipped or not on main branch."
fi

# 3. Pull latest base images
echo "🐳 Pulling Docker base images..."
docker compose pull postgres redis minio minio-init caddy

# 4. Build Application Image
echo "🔨 Building Next.js application container..."
docker compose build app

# 5. Start Core Services
echo "📦 Starting Database and Storage services..."
docker compose up -d postgres redis minio minio-init

# 6. Wait for Postgres to be healthy
echo "⏳ Waiting for PostgreSQL to be ready..."
docker compose exec postgres /bin/sh -c 'until pg_isready -U postgres -d metrikmedia; do sleep 1; done'

# 7. Run Database Migrations
echo "🗄️ Running database migrations..."
if command -v pnpm &> /dev/null; then
    pnpm db:migrate || echo "⚠️ Host migration skipped, relying on container/seed."
fi

# 8. Start All Services & Reverse Proxy
echo "🌐 Starting Application and Reverse Proxy..."
docker compose up -d --remove-orphans

# 9. Clean up old unused images
echo "🧹 Cleaning up unused Docker images..."
docker image prune -f

echo "✅ ====================================================================="
echo "🎉 Metrik Media Indonesia is successfully running with Docker Compose!"
echo "👉 Check status with: docker compose ps"
echo "👉 Check logs with  : docker compose logs -f"
echo "======================================================================="
