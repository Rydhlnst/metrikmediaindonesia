#!/usr/bin/env bash
# ==============================================================================
# METRIK MEDIA INDONESIA - SINGLE-SERVER PRODUCTION DEPLOY SCRIPT
# ==============================================================================

set -Eeuo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

ENV_FILE="${ENV_FILE:-.env}"
COMPOSE=(docker compose --env-file "$ENV_FILE")

echo "🚀 Starting Metrik Media Indonesia Deployment..."

# 1. Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: $ENV_FILE is missing. Create it from .env.example and set production secrets."
    exit 1
fi

set -a
. "./$ENV_FILE"
set +a

required_vars=(
    NODE_ENV DOMAIN NEXT_PUBLIC_APP_URL BETTER_AUTH_SECRET CRON_SECRET
    POSTGRES_URL POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD
    REDIS_URL MINIO_ROOT_USER MINIO_ROOT_PASSWORD MINIO_BUCKET MINIO_PUBLIC_URL
    ADMIN_EMAIL ADMIN_PASSWORD
)

for required in "${required_vars[@]}"; do
    value="${!required:-}"
    if [ -z "$value" ] || [[ "$value" =~ (change_in_production|generate_|change_me|local_.*change_me) ]]; then
        echo "❌ Error: ${required} must be set to a unique production value."
        exit 1
    fi
done

if [[ ! "${ADMIN_EMAIL}" =~ ^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$ ]] || [[ "${ADMIN_EMAIL}" == *@example.com ]] || [[ "${ADMIN_EMAIL}" == *@example.invalid ]]; then
    echo "❌ Error: ADMIN_EMAIL must be a valid email address."
    exit 1
fi

if (( ${#ADMIN_PASSWORD} < 12 )) || [[ "${ADMIN_PASSWORD}" == "admin123" ]] || [[ "${ADMIN_PASSWORD}" == use-a-strong-password* ]]; then
    echo "❌ Error: ADMIN_PASSWORD must be at least 12 characters long."
    exit 1
fi

if [ "${NODE_ENV}" != "production" ]; then
    echo "❌ Error: NODE_ENV must be production."
    exit 1
fi

if [ "${TRUST_PROXY_HEADERS:-false}" != "true" ]; then
    echo "❌ Error: TRUST_PROXY_HEADERS must be true behind Caddy/Cloudflare."
    exit 1
fi

if [ -z "${SMTP_HOST:-}" ] && [ -z "${RESEND_API_KEY:-}" ]; then
    echo "❌ Error: configure SMTP_* or RESEND_API_KEY for production email."
    exit 1
fi

command -v docker >/dev/null 2>&1 || { echo "❌ Error: Docker is not installed."; exit 1; }

# 2. Pull latest git changes (if in git repo)
if [ -d ".git" ]; then
    branch="$(git branch --show-current)"
    if [ "$branch" != "main" ] && [ "$branch" != "master" ]; then
        echo "❌ Error: deploy from the main or master branch only (current: ${branch:-detached})."
        exit 1
    fi
    echo "📥 Pulling latest git repository updates..."
    git pull --ff-only origin "$branch"
fi

echo "🔍 Validating Docker Compose configuration..."
"${COMPOSE[@]}" config --quiet

# 3. Pull latest base images
echo "🐳 Pulling Docker base images..."
"${COMPOSE[@]}" pull postgres redis minio minio-init caddy

# 4. Build Application Image
echo "🔨 Building application and migration containers..."
"${COMPOSE[@]}" build app db-migrate db-seed caddy

# 5. Start Core Services
echo "🌐 Starting services, migrations, application, proxy, and cron..."
"${COMPOSE[@]}" up -d --build --remove-orphans --wait

echo "📋 Service status:"
"${COMPOSE[@]}" ps

echo "✅ ====================================================================="
echo "🎉 Metrik Media Indonesia is successfully running with Docker Compose!"
echo "👉 Check status with: ${COMPOSE[*]} ps"
echo "👉 Check logs with  : ${COMPOSE[*]} logs -f"
echo "======================================================================="
