#!/usr/bin/env sh
set -eu

: "${MINIO_ALIAS:?MINIO_ALIAS is required, for example https://minio.example.com}"
: "${MINIO_ACCESS_KEY:?MINIO_ACCESS_KEY is required}"
: "${MINIO_SECRET_KEY:?MINIO_SECRET_KEY is required}"
: "${MINIO_BUCKET:?MINIO_BUCKET is required}"
BACKUP_DIR="${BACKUP_DIR:-./backups/minio}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

mkdir -p "$BACKUP_DIR"
mc alias set metrikmedia-backup "$MINIO_ALIAS" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"
target="$BACKUP_DIR/$(date -u +%Y%m%dT%H%M%SZ)"
mc mirror "metrikmedia-backup/$MINIO_BUCKET" "$target"
find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime "+$RETENTION_DAYS" -exec rm -rf {} \;
printf 'MinIO backup created: %s\n' "$target"
