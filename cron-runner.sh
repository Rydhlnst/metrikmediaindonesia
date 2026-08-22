#!/bin/sh
set -eu

APP_URL="${APP_URL:-http://app:3000}"
CRON_SECRET="${CRON_SECRET:-}"

if [ -z "$CRON_SECRET" ]; then
  echo "[cron] CRON_SECRET not set, skipping cron jobs"
  exit 0
fi

echo "[cron] Cron scheduler started"

while true; do
  echo "[cron] Running scheduled tasks at $(date -u +%Y-%m-%dT%H:%M:%SZ)"

  # Publish scheduled articles (every minute)
  HTTP_CODE=$(wget -q -O /dev/null --header="Authorization: Bearer $CRON_SECRET" \
    "$APP_URL/api/cron/publish-scheduled" 2>&1 || echo "000")
  echo "[cron] publish-scheduled: HTTP $HTTP_CODE"

  # Author milestones (every day at 08:00 UTC)
  CURRENT_HOUR=$(date -u +%H)
  if [ "$CURRENT_HOUR" = "08" ]; then
    HTTP_CODE=$(wget -q -O /dev/null --header="Authorization: Bearer $CRON_SECRET" \
      "$APP_URL/api/cron/author-milestones" 2>&1 || echo "000")
    echo "[cron] author-milestones: HTTP $HTTP_CODE"
  fi

  sleep 60
done
