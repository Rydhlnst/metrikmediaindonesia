#!/usr/bin/env sh
set -eu

: "${POSTGRES_URL:?POSTGRES_URL is required}"
BACKUP_DIR="${BACKUP_DIR:-./backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
mkdir -p "$BACKUP_DIR"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
output="$BACKUP_DIR/metrikmedia-$timestamp.dump"
pg_dump "$POSTGRES_URL" --format=custom --file="$output"
find "$BACKUP_DIR" -type f -name '*.dump' -mtime "+$RETENTION_DAYS" -delete
printf 'PostgreSQL backup created: %s\n' "$output"
