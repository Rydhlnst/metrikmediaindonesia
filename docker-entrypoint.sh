#!/bin/sh
set -u

startup_degraded=false

if [ "${NODE_ENV:-production}" = "production" ]; then
  if ! node /app/scripts/validate-production.mjs; then
    startup_degraded=true
    echo "[app] Startup validation failed; keeping the app running in degraded mode."
    echo "[app] Readiness: /api/health | Liveness: /api/health/live"
  fi
fi

export APP_STARTUP_DEGRADED="$startup_degraded"
exec node server.js
