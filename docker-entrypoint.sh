#!/bin/sh
set -eu

if [ "${NODE_ENV:-production}" = "production" ]; then
  node /app/scripts/validate-production.mjs
fi

exec node server.js
